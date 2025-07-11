// components/common/KeyboardHeightAdjuster.tsx
'use client';

import { useEffect } from 'react';

export default function KeyboardHeightAdjuster() {
  useEffect(() => {
    const resizeHandler = () => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) return;

      const windowHeight = window.innerHeight;
      document.body.style.height = `${windowHeight}px`;
    };

    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return null;
}
