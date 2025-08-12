'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Route } from 'next';

const nav = [
  { href: '/', label: 'TOP' },
  { href: '/pairings', label: 'Pairings' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/results', label: 'Results' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/entry', label: 'Entry' },
] satisfies ReadonlyArray<{ href: Route; label: string }>;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="#1E8E3E" strokeWidth="2" />
            <path d="M8 16c3-1 6-1 8 0" stroke="#1E8E3E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold">SW Invitational</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {nav.map((n) => (
            <motion.div whileHover={{ y: -1 }} key={n.href}>
              <Link href={n.href} className="px-2 py-1 rounded hover:bg黑/5">
                {n.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </header>
  );
}
