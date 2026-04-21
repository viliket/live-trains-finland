import { createRef, useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

import { styled } from '@mui/material';
import { SnapPositionChangeEventDetail } from 'pure-web-bottom-sheet';
import { BottomSheet as BottomSheetBase } from 'pure-web-bottom-sheet/react';

const StyledBottomSheet = styled(BottomSheetBase)(({ theme }) => ({
  '--sheet-background': theme.palette.common.secondaryBackground.default,
  '--sheet-max-height': 'calc(100vh - 24px)',
  scrollTimeline: '--sheet-timeline y',
  // Must use absolute positioning for position-anchor to work correctly
  // in case the bottom sheet appears later in the DOM tree than the anchored element
  position: 'absolute',
  '&::part(sheet)': {
    anchorName: '--sheet',
    scrollSnapStop: 'always',
  },
  '&::part(header)': {
    zIndex: 1001,
  },
  '&::part(handle)': {
    backgroundColor: theme.palette.divider,
  },
  // Re-anchor box-sizing as slotted content cannot inherit it across the shadow boundary
  '& > *': { boxSizing: 'border-box' },
}));

type BottomSheetProps = {
  ref?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  header?: React.ReactNode;
  onScroll?: (sheetOffset: number) => void;
  onTransitionStart?: (sheetOffset: number) => void;
  onTransitionEnd?: (sheetOffset: number) => void;
  onSnapPositionChange?: (
    event: CustomEvent<SnapPositionChangeEventDetail>
  ) => void;
};

export default function BottomSheet({
  children,
  header,
  onTransitionEnd,
  onTransitionStart,
  onScroll,
  onSnapPositionChange,
  ref,
}: BottomSheetProps) {
  const innerRef = useMemo(() => ref ?? createRef<HTMLElement>(), [ref]);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTransitionStartRef = useRef(onTransitionStart);
  const onTransitionEndRef = useRef(onTransitionEnd);
  const onScrollRef = useRef(onScroll);
  const onSnapPositionChangeRef = useRef(onSnapPositionChange);
  useEffect(() => {
    onTransitionStartRef.current = onTransitionStart;
    onTransitionEndRef.current = onTransitionEnd;
    onScrollRef.current = onScroll;
    onSnapPositionChangeRef.current = onSnapPositionChange;
  }, [onTransitionStart, onTransitionEnd, onScroll, onSnapPositionChange]);

  const handleSnapPositionChange = useCallback(
    (event: CustomEvent<SnapPositionChangeEventDetail>) => {
      onSnapPositionChangeRef.current?.(event);
    },
    []
  );

  const handleScroll = useCallback(() => {
    onScrollRef.current?.(innerRef.current ? innerRef.current.scrollTop : 0);
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    } else {
      if (onTransitionStartRef.current && innerRef.current) {
        onTransitionStartRef.current(innerRef.current.scrollTop);
      }
    }
    scrollEndTimerRef.current = setTimeout(() => {
      scrollEndTimerRef.current = null;
      if (!innerRef.current) return;

      if (onTransitionEndRef.current) {
        onTransitionEndRef.current(innerRef.current.scrollTop);
      }
    }, 100);
  }, [innerRef]);

  return (
    <StyledBottomSheet
      ref={innerRef}
      onScroll={handleScroll}
      onsnap-position-change={handleSnapPositionChange}
      content-height
    >
      <div slot="header">{header}</div>
      {children}
    </StyledBottomSheet>
  );
}
