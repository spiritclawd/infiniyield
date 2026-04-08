import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'INFINIYIELD — Trap the Whale',
  description:
    'Deposit wBTC forever. Earn yield from DeFi. Out-commit everyone on the leaderboard.',
  keywords: ['Starknet', 'Bitcoin', 'DeFi', 'Yield', 'wBTC', 'Trap the Whale'],
  authors: [{ name: 'INFINIYIELD' }],
  openGraph: {
    title: 'INFINIYIELD — Trap the Whale',
    description: 'Deposit wBTC forever. Earn yield from DeFi. Out-commit everyone.',
    type: 'website',
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
