'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import type { Tournament } from '@/lib/types';

// QR動的 import
async function genQrDataUrl(text: string) {
  const { toDataURL } = await import('qrcode');
  return await toDataURL(text, { margin: 1, width: 220 });
}
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TopClient({ current, past }: { current: Tournament | null; past: Tournament[] }) {
  const [gallery, setGallery] = useState<string[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  const strip = useMemo(() => {
    const pick = shuffle(gallery).slice(0, Math.min(12, gallery.length || 0));
    return [...pick, ...pick];
  }, [gallery]);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then((urls: string[]) => setGallery(urls || [])).catch(() => setGallery([]));
  }, []);

  async function onShareUrl() {
    const url = window.location.origin;
    const title = current?.title || 'SW Invitational';
    const text = current ? `${current.title} / ${current.dateLabel ?? ''} @ ${current.course ?? ''}` : 'SW Invitational';
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    alert('URLをコピーしました');
  }
  async function onShareQr() {
    const url = window.location.origin;
    const dataUrl = await genQrDataUrl(url);
    setQrUrl(dataUrl);
    setQrOpen(true);
  }

  const gcal = current?.dateStartUtc && current?.dateEndUtc
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(current.title)}&details=${encodeURIComponent('SW Invitational')}&location=${encodeURIComponent(`${current.course ?? ''} ${current.address ?? ''}`)}&dates=${current.dateStartUtc}/${current.dateEndUtc}`
    : null;

  return (
    <section className="grid gap-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card earth-card relative">
        <div className="icon-row">
          <button className="icon-btn" onClick={onShareUrl} aria-label="URLで共有"><LinkIcon /></button>
          <button className="icon-btn" onClick={onShareQr} aria-label="QRで共有"><QrIcon /></button>
        </div>

        <div className="grid md:grid-cols-[1fr,360px] gap-4 items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{current?.title ?? 'SW Invitational'}</h1>
            <p className="mt-2 text-black/70">
              今年もやります。楽しんだ人が勝ち。ベストショットはギャラリーに上げてみんなでワイワイしよう。
            </p>

            <div className="mt-4 grid gap-1 text-sm">
              {current?.dateLabel && <div><span className="font-medium">日付：</span>{current.dateLabel}</div>}
              {current?.course && <div><span className="font-medium">ゴルフ場：</span>{current.course}</div>}
              {current?.address && <div className="text-black/70"><span className="font-medium text-black/80">住所：</span>{current.address}</div>}
              {typeof current?.participants === 'number' && <div className="text-black/70"><span className="font-medium text-black/80">参加人数：</span>{current.participants} 名</div>}
              {typeof current?.fee === 'number' && <div className="text-black/70"><span className="font-medium text-black/80">参加費：</span>¥{current.fee.toLocaleString()}</div>}
            </div>

            {/* エントリー */}
            <div className="mt-4">
              <Link href={'/entry' satisfies Route} className="btn-cta inline-flex items-center gap-2">⛳ エントリーする</Link>
            </div>

            {/* 二次導線（リーダーボードは落とし） */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={'/pairings' satisfies Route} className="btn-primary">組み合わせ</Link>
              {current?.website && <a href={current.website} target="_blank" rel="noreferrer" className="btn-primary">ゴルフ場サイト</a>}
              {current?.gmaps && <a href={current.gmaps} target="_blank" rel="noreferrer" className="btn-primary">地図を見る</a>}
              {gcal && <a href={gcal} target="_blank" rel="noreferrer" className="btn-primary">Googleカレンダー</a>}
            </div>
          </div>

          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-thumb"
              src={current?.thumbnail || gallery[0] || 'https://images.unsplash.com/photo-1518609571773-39b7d303a87a?q=80&w=1200&auto=format&fit=crop'}
              alt="event-thumbnail"
            />
          </div>
        </div>

        {qrOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 grid place-items-center" onClick={() => setQrOpen(false)}>
            <div className="bg-white rounded-2xl p-4 w-[280px] border border-black/10" onClick={(e) => e.stopPropagation()}>
              <div className="text-sm font-medium mb-2">このページをQRで共有</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="w-full rounded-lg border border-black/10" />
              <button className="btn-primary mt-3 w-full" onClick={() => setQrOpen(false)}>閉じる</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* 過去の大会（詳細→ /leaderboard?t=slug に遷移） */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">過去の大会</h2>
          <Link href={'/past' satisfies Route} className="text-sm underline">一覧を見る</Link>
        </div>
        {past.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {past.map((t) => (
              <article key={t.slug} className="card">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-black/60 mt-1">{t.dateLabel ?? ''}{t.course ? ` ・ ${t.course}` : ''}</div>
                <Link
                  href={{ pathname: '/leaderboard', query: { t: t.slug } }}
                  className="btn-primary mt-3 inline-flex"
                >
                  詳細（リーダーボード）
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-sm text-black/60">まだ過去大会はありません。</div>
        )}
      </section>

      {/* 横スクロール・ギャラリー */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">ギャラリー</h2>
          <Link href={'/gallery' satisfies Route} className="text-sm underline">もっと見る</Link>
        </div>
        {strip.length > 0 ? (
          <div className="gallery-strip">
            <div className="gallery-track">
              {strip.map((u, i) => (
                <Link href="/gallery" key={`${u}-${i}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt={`g-${i}`} className="h-28 w-[180px] md:h-32 md:w-[220px] object-cover rounded-xl border border-black/10" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-black/60">まだ写真がありません。</div>
        )}
      </section>
    </section>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 14a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 10a5 5 0 0 1 0 7L12.5 18.5a5 5 0 0 1-7-7L7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function QrIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3h8v8H3V3Z" stroke="currentColor" strokeWidth="2"/><path d="M13 3h8v8h-8V3Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 13h8v8H3v-8Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 13h2v2h-2v-2Zm-3 3h2v2h-2v-2Zm6 0h2v2h-2v-2Zm-3 3h5v2h-5v-2Z" fill="currentColor"/>
    </svg>
  );
}
