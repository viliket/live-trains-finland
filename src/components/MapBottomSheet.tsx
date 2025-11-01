import { createRef, useCallback, useMemo } from 'react';
import { useEffect } from 'react';

import { MapRef, useMap } from 'react-map-gl/maplibre';

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
  container.style.setProperty('--control-offset-bottom', `${bottomOffset}px`);
  container.style.setProperty(
    '--control-offset-progress',
    `${clampedScrollOffset / maxScrollableHeight}`
  );
}

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
    >
      {children}
    </BottomSheet>
  );
}
