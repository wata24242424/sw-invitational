import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import DotBackground from '@/components/DotBackground';

export const metadata: Metadata = {
  title: 'SW Invitational',
  description: 'Golf tournament site',
  other: { 'theme-color': '#ffffff' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <Header />
        <DotBackground>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </DotBackground>
      </body>
    </html>
  );
}
