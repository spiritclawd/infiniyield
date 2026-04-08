import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'INFINIYIELD — Permanent Capital. Perpetual Yield.',
  description:
    'The most powerful commitment in DeFi. Your wBTC enters. It never leaves. That\'s the point. Permanent capital, perpetual yield, no exit.',
  keywords: ['Starknet', 'Bitcoin', 'DeFi', 'Yield', 'wBTC', 'Trap the Whale', 'Permanent Capital', 'INFINIYIELD'],
  authors: [{ name: 'INFINIYIELD' }],
  openGraph: {
    title: 'INFINIYIELD — Permanent Capital. Perpetual Yield. No Exit.',
    description:
      'Your wBTC enters. It never leaves. That\'s the point. Epoch-based leaderboard, perpetual yield, permanent commitment.',
    type: 'website',
    siteName: 'INFINIYIELD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INFINIYIELD — Permanent Capital. Perpetual Yield.',
    description: 'The most powerful commitment in DeFi. Lock wBTC forever, earn yield every epoch.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-[#0a0a0f] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
