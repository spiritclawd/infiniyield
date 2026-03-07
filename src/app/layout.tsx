import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INFINIYIELD | Infinite Yield Gaming Platform",
  description: "Entry fees compound into infinite yield for top players. 90% of fees flow into BTC vaults that generate perpetual rewards. Play. Earn. Yield.",
  keywords: ["Starknet", "Bitcoin", "Gaming", "DeFi", "Yield", "Blockchain", "Game Jam", "Dojo"],
  authors: [{ name: "INFINIYIELD Team" }],
  openGraph: {
    title: "INFINIYIELD | Infinite Yield Gaming",
    description: "Entry fees compound into infinite yield for top players",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "INFINIYIELD",
    description: "Entry fees compound into infinite yield for top players",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
