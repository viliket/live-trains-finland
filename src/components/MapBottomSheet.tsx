import { createRef, useCallback, useMemo } from 'react';
import { useEffect } from 'react';

import { MapRef, useMap } from 'react-map-gl/maplibre';
import { create } from 'zustand';

import BottomSheet from './BottomSheet';

const supportsScrollAnimations =
  typeof window !== 'undefined' &&
  'CSS' in window &&
  CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

function setMapControlsOffset(
  map: MapRef,
  bottomSheetEl: HTMLElement,
  offset: number
) {
  if (supportsScrollAnimations) return;
  const container = map.getContainer();

  const viewportHeight = window.innerHeight;
  const clampedScrollOffset = Math.min(offset, viewportHeight);
  const maxScrollableHeight = Math.max(
    viewportHeight,
    Math.min(
      bottomSheetEl.scrollHeight - bottomSheetEl.offsetHeight,
      viewportHeight
    )
  );

  const sheetRect = bottomSheetEl.getBoundingClientRect();
  const bottomOffset = viewportHeight - sheetRect.bottom + clampedScrollOffset;
  const controlOffsetProgress = clampedScrollOffset / maxScrollableHeight;
  container.style.setProperty('--control-offset-bottom', `${bottomOffset}px`);
  container.style.setProperty(
    '--control-offset-progress',
    `${controlOffsetProgress}`
  );
  if (controlOffsetProgress > 0.95) {
    container.dataset.hideControls = '';
  } else {
    delete container.dataset.hideControls;
  }
}

interface MapBottomSheetState {
  currentSnapIndex: number;
  setCurrentSnapIndex: (newSnapIndex: number) => void;
}

const useMapBottomSheetStore = create<MapBottomSheetState>((set) => ({
  currentSnapIndex: 2,
  setCurrentSnapIndex: (newSnapIndex) =>
    set({ currentSnapIndex: newSnapIndex }),
}));

type MapBottomSheetProps = {
  ref?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  header?: React.ReactNode;
};

export default function MapBottomSheet({
  children,
  header,
  ref,
}: MapBottomSheetProps) {
  const { vehicleMap: map } = useMap();
  const innerRef = useMemo(() => ref ?? createRef<HTMLElement>(), [ref]);
  const currentSnapIndex = useMapBottomSheetStore(
    (state) => state.currentSnapIndex
  );
  const setCurrentSnapIndex = useMapBottomSheetStore(
    (state) => state.setCurrentSnapIndex
  );

  useEffect(() => {
    if (!map || !innerRef.current) return;
    setMapControlsOffset(map, innerRef.current, innerRef.current.scrollTop);
  }, [innerRef, map]);

  const handleScroll = useCallback(
    (offset: number) => {
      if (!map || !innerRef.current) return;
      setMapControlsOffset(map, innerRef.current, offset);
    },
    [map, innerRef]
  );

  useEffect(() => {
    if (!map || !innerRef.current) return;
    map.setPadding({ bottom: innerRef.current.scrollTop });
  }, [innerRef, map]);

  return (
    <BottomSheet
      ref={innerRef}
      header={header}
      onTransitionEnd={(offset) => {
        map?.flyTo({
          padding: { bottom: offset },
        });
      }}
      onScroll={handleScroll}
      onSnapPositionChange={(e) => setCurrentSnapIndex(e.detail.snapIndex)}
    >
      {['100%', '75vh', '50vh', '25vh'].map(
        (snapPoint, i, { length: snapPointCount }) => {
          const snapIndex = snapPointCount - i;
          const isInitial = snapIndex === currentSnapIndex;
          return (
            <div
              key={snapPoint}
              slot="snap"
              style={{ '--snap': snapPoint }}
              data-snap={i === 0 ? 'top' : undefined}
              className={isInitial ? 'initial' : ''}
            />
          );
        }
      )}
      {children}
    </BottomSheet>
  );
}
