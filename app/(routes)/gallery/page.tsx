'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then((u: string[]) => setUrls(u || []));
  }, []);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    e.currentTarget.style.setProperty('--mx', `${mx}px`);
    e.currentTarget.style.setProperty('--my', `${my}px`);
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ギャラリー</h1>
        <div className="text-sm text-black/60">※ 投稿は運営のみ（閲覧専用）</div>
      </div>

      {urls.length === 0 ? (
        <div className="card text-sm text-black/60">写真がまだありません。</div>
      ) : (
        <div className="masonry">
          {urls.map((u, i) => (
            <motion.div
              key={u}
              className="tile group"
              onMouseMove={onMove}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => setActive(u)}
            >
              <div className="glow" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`g-${i}`} loading="lazy" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active} alt="preview" />
        </div>
      )}
    </section>
  );
}
