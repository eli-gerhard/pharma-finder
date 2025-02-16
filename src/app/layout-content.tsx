// app/layout-content.tsx
'use client';

import { useEffect } from 'react';
import type { NextFont } from 'next/dist/compiled/@next/font';

export default function RootLayoutContent({
  children,
  inter,
}: {
  children: React.ReactNode;
  inter: NextFont;
}) {
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--scroll', `${-window.scrollY * 0.5}px`);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
        }, []);
    return (
        <body className={`${inter.className} min-h-screen relative`}>
        <div className="gradient-overlay" />
        <div className="noise" />
            {children}
        </body>
  );
}