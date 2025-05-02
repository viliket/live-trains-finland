import React, { useCallback, useEffect, useRef } from 'react';

import { styled } from '@mui/material';

const DrawerContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 'calc(100% - var(--drawer-top-margin))',
  display: 'block',
  overflowY: 'scroll',
  scrollBehavior: 'smooth',
  scrollSnapType: 'y mandatory',
  scrollbarWidth: 'none',
  zIndex: 10,
  pointerEvents: 'none',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  '&[data-drawer-snap-position="-1"]': {
    '.spacer': {
      scrollSnapAlign: 'none',
    },
    '.drawer': {
      scrollSnapAlign: 'none',
    },
  },
  '--drawer-top-margin': '24px',
  '.spacer': {
    scrollSnapAlign: 'start',
    flexShrink: 0,
  },
  '> .spacer:first-child': {
    // Rubber band effect when the drawer is pulled down
    marginTop: '50px',
  },
  '.spacer-30': { height: '38vh' },
  '.spacer-60': { height: '40vh' },
  '.spacer-100': { height: 0 },
  '.drawer': {
    minHeight: '100vh',
    backgroundColor: theme.palette.common.secondaryBackground.default,
    overflow: 'clip',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    scrollSnapAlign: 'start',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    paddingTop: 4,
    // Temporary workaround for iOS Safari bug https://bugs.webkit.org/show_bug.cgi?id=183870
    '@supports (-webkit-touch-callout: none)': {
      overflowX: 'scroll',
      scrollbarWidth: 'none',
      overscrollBehaviorX: 'none',
      '.sentinel': {
        width: 'calc(100% + 1px)',
      },
    },
  },
  '.handle': {
    width: '40px',
    height: '6px',
    background: '#ccc',
    borderRadius: '3px',
    margin: '8px auto',
    position: 'sticky',
    top: '12px',
    zIndex: '1002',
  },
  '.sentinel': {
    height: '1px',
  },
}));

function getDrawerOffset(
  drawer: HTMLDivElement,
  drawerWrapper: HTMLDivElement
) {
  return (
    drawerWrapper.offsetHeight - drawer.offsetTop + drawerWrapper.scrollTop
  );
}

function getCurrentSnapPosition(drawerWrapper: HTMLDivElement | null) {
  if (drawerWrapper?.dataset.drawerSnapPosition) {
    return Number.parseInt(drawerWrapper.dataset.drawerSnapPosition);
  } else {
    return null;
  }
}

type DrawerProps = {
  children: React.ReactNode;
  onTransitionStart?: (drawerOffset: number, snap: number | null) => void;
  onTransitionEnd?: (drawerOffset: number, snap: number | null) => void;
  onSnapPositionChange?: (snap: number) => void;
};

export default function Drawer({
  children,
  onTransitionStart,
  onTransitionEnd,
  onSnapPositionChange,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTransitionStartRef = useRef(onTransitionStart);
  const onTransitionEndRef = useRef(onTransitionEnd);
  const onSnapPositionChangeRef = useRef(onSnapPositionChange);
  useEffect(() => {
    onTransitionStartRef.current = onTransitionStart;
    onTransitionEndRef.current = onTransitionEnd;
    onSnapPositionChangeRef.current = onSnapPositionChange;
  }, [onTransitionStart, onTransitionEnd, onSnapPositionChange]);

  useEffect(() => {
    document
      .querySelector('.spacer-60')
      ?.scrollIntoView({ behavior: 'instant' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!drawerWrapperRef.current) return;
        let lowestIntersectingSnap = Infinity;
        let highestNonIntersectingSnap = -1;
        let hasIntersectingElement = false;

        for (const entry of entries) {
          if (
            !(entry.target instanceof HTMLElement) ||
            entry.target.dataset.snap == null
          ) {
            continue;
          }

          const snap = Number.parseInt(entry.target.dataset.snap);

          if (entry.isIntersecting) {
            hasIntersectingElement = true;
            lowestIntersectingSnap = Math.min(lowestIntersectingSnap, snap);
          } else {
            highestNonIntersectingSnap = Math.max(
              highestNonIntersectingSnap,
              snap
            );
          }
        }

        const newSnapPosition = hasIntersectingElement
          ? lowestIntersectingSnap
          : highestNonIntersectingSnap + 1;

        drawerWrapperRef.current.dataset.drawerSnapPosition =
          newSnapPosition.toString();
        onSnapPositionChangeRef.current?.(newSnapPosition);
      },
      {
        root: drawerWrapperRef.current,
        threshold: 0,
        rootMargin: '1000% 0px -100% 0px',
      }
    );

    if (drawerWrapperRef.current) {
      const sentinels =
        drawerWrapperRef.current.getElementsByClassName('sentinel');
      Array.from(sentinels).forEach((sentinel) => {
        observer.observe(sentinel);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    } else {
      if (
        onTransitionStartRef.current &&
        drawerRef.current &&
        drawerWrapperRef.current
      ) {
        const drawerOffset = getDrawerOffset(
          drawerRef.current,
          drawerWrapperRef.current
        );
        onTransitionStartRef.current(
          drawerOffset,
          getCurrentSnapPosition(drawerWrapperRef.current)
        );
      }
    }
    scrollEndTimerRef.current = setTimeout(() => {
      scrollEndTimerRef.current = null;
      if (!drawerWrapperRef.current || !drawerRef.current) return;

      if (onTransitionEndRef.current) {
        const drawerOffset = getDrawerOffset(
          drawerRef.current,
          drawerWrapperRef.current
        );
        onTransitionEndRef.current(
          drawerOffset,
          getCurrentSnapPosition(drawerWrapperRef.current)
        );
      }
    }, 100);
  }, []);

  return (
    <DrawerContainer ref={drawerWrapperRef} onScroll={handleScroll}>
      {/* Spacers to control drawer position */}
      <div className="spacer spacer-30"></div>
      <div className="spacer spacer-60"></div>

      {/* Top snap position */}
      <div className="sentinel" data-snap={0}></div>
      <div ref={drawerRef} className="drawer">
        {/* Expanded snap position */}
        <div className="sentinel" data-snap={-1}></div>
        <div className="spacer spacer-100"></div>
        <div className="handle"></div>
        {children}
      </div>
    </DrawerContainer>
  );
}
