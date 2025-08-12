import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold">SW Invitational</Link>
        <nav className="ml-4 flex items-center gap-2 text-sm">
  <Link href="/gallery" className="px-2 py-1 rounded hover:bg-black/5">Gallery</Link>
  <Link href="/past" className="px-2 py-1 rounded hover:bg-black/5">過去の大会</Link>
  <a href="/tips" className="px-2 py-1 rounded hover:bg_black/5">豆知識</a>
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
