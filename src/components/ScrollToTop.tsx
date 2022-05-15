import { useEffect } from 'react';

import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Scroll to top except when navigating backwards in history
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [navigationType, pathname]);

  return null;
};

export default ScrollToTop;
