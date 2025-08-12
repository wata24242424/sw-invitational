import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold">SW Invitational</Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/gallery">ギャラリー</Link>
          <Link href="/past">過去の大会</Link>
          <Link href="/tips">豆知識</Link>
        </nav>
      </div>
      <Link
        href="/entry"
        className="btn-cta"
      >
        エントリー
      </Link>
    </header>
  );
}
