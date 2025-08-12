/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import type { Tournament, LeaderboardGrid, Award, ResultsRow } from '@/lib/types';

export default function ShareShot({
  current,
  grid,
  top3,
  awards,
}: {
  current: Tournament | null;
  grid: LeaderboardGrid;
  top3: ResultsRow[];
  awards: Award[];
}) {
  const [busy, setBusy] = useState(false);

  async function savePng() {
    setBusy(true);
    try {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      const htmlToImage: typeof import('html-to-image') = await import('html-to-image');
      const node = document.getElementById('lbArea');
      if (!node) throw new Error('Capture target not found');

      const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = (current?.title ? `${current.title}-` : '') + 'leaderboard.png';
      a.click();
    } catch {
      alert('PNG保存用のモジュールが見つかりませんでした。URL共有をご利用ください。');
    } finally {
      setBusy(false);
    }
  }

  async function shareUrl() {
    const url = window.location.href;
    const title = current?.title || 'SW Invitational';
    const text = `${title} のリーダーボード`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch { /* noop */ }
    }
    await navigator.clipboard.writeText(url);
    alert('URLをコピーしました');
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-primary" onClick={savePng} disabled={busy}>
        {busy ? '生成中…' : 'PNGで保存'}
      </button>
      <button className="btn-primary" onClick={shareUrl}>
        URLを共有
      </button>
    </div>
  );
}
