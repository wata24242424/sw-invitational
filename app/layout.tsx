import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import DotBackground from '@/components/DotBackground';
import { M_PLUS_Rounded_1c } from 'next/font/google';

const rounded = M_PLUS_Rounded_1c({
  weight: ['400','500','700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SW Invitational',
  description: 'Golf tournament site',
  other: { 'theme-color': '#ffffff' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${rounded.className} min-h-screen`} suppressHydrationWarning>
        <Header />
        <DotBackground>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </DotBackground>
      </body>
    </html>
  );
}
