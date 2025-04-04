import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import RootLayoutContent from './layout-content';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InStockMed | Find In Stock Medications',
  description: 'Search for in-stock medications at pharmacies near you. Crowd sourced availability information for medications experiencing shortages.',
  keywords: 'pharmacy finder, medication availability, prescription drugs, pharmacy search, medication stock, in stock med, in stock medication',
  openGraph: {
    title: 'InStockMed',
    description: 'Find in stock medications at pharmacies near you',
    url: 'https://www.instockmed.com',
    siteName: 'InStockMed',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={`${inter.className} min-h-screen relative`}>
        <div className="gradient-overlay" />
        <div className="noise" />
        <div className="relative z-10">
          {children}
        </div>
      </body> */}
      <RootLayoutContent inter={inter}>{children}</RootLayoutContent>
    </html>
  );
}