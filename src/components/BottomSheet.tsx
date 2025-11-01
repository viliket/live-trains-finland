import { createRef, useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

import { styled } from '@mui/material';
import { BottomSheet as BottomSheetBase } from 'pure-web-bottom-sheet/react';

const StyledBottomSheet = styled(BottomSheetBase)(({ theme }) => ({
  '--sheet-background': theme.palette.common.secondaryBackground.default,
  '--sheet-max-height': 'calc(100vh - 24px)',
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
}));

type BottomSheetProps = {
  ref?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  header?: React.ReactNode;
  onScroll?: (sheetOffset: number) => void;
  onTransitionStart?: (sheetOffset: number) => void;
  onTransitionEnd?: (sheetOffset: number) => void;
};

export default function BottomSheet({
  children,
  header,
  onTransitionEnd,
  onTransitionStart,
  onScroll,
  ref,
}: BottomSheetProps) {
  const innerRef = useMemo(() => ref ?? createRef<HTMLElement>(), [ref]);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTransitionStartRef = useRef(onTransitionStart);
  const onTransitionEndRef = useRef(onTransitionEnd);
  const onScrollRef = useRef(onScroll);
  useEffect(() => {
    onTransitionStartRef.current = onTransitionStart;
    onTransitionEndRef.current = onTransitionEnd;
    onScrollRef.current = onScroll;
  }, [onTransitionStart, onTransitionEnd, onScroll]);

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
    <StyledBottomSheet ref={innerRef} onScroll={handleScroll} content-height>
      <div slot="snap" style={{ '--snap': '75vh' }}></div>
      <div slot="snap" style={{ '--snap': '50vh' }} className="initial"></div>
      <div slot="snap" style={{ '--snap': '25vh' }}></div>

      <div slot="header">{header}</div>
      {children}
    </StyledBottomSheet>
  );
}
