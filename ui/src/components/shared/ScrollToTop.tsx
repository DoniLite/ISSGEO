import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  useEffect(() => {
    globalThis.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
