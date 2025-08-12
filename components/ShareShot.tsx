'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import type { LeaderboardGrid, Tournament, ResultsRow, Award } from '@/lib/types';

type Props = {
  current?: Tournament | null;
  grid: LeaderboardGrid;
  top3: Array<{ place: number; name: string; gross: number; net: number; hc: number }>;
  awards?: Award[];
};

/** PNGダウンロード */
async function downloadNodePng(node: HTMLElement, fileName: string, bg = '#ffffff', width?: number, height?: number) {
  const dataUrl = await htmlToImage.toPng(node, {
    pixelRatio: 2,
    backgroundColor: bg,
    width,
    height,
    style: width && height ? { width: `${width}px`, height: `${height}px` } : undefined,
    cacheBust: true,
  });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  a.click();
}

export default function ShareShot({ current, grid, top3, awards = [] }: Props) {
  const [openPreview, setOpenPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // テーブルスクショは、ページ側で id="lbArea" を囲っておく想定
  const captureTable = useCallback(async () => {
    const node = document.getElementById('lbArea');
    if (!node) { alert('テーブル要素が見つかりませんでした。'); return; }
    await downloadNodePng(node as HTMLElement, 'leaderboard-table', '#ffffff');
  }, []);

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return;
    await downloadNodePng(cardRef.current, 'leaderboard-share-card', '#ffffff', 1200, 630);
  }, []);

  // 上位3の整形（results優先の値が来ている前提）
  const podium = useMemo(() => {
    if (top3.length) return top3;
    // 万一空なら、gridから暫定
    const parTotal = grid.par.reduce((a, b) => (Number.isNaN(b) ? a : a + b), 0);
    return grid.players
      .filter(p => p.gross != null)
      .sort((a, b) => (a.gross! - b.gross!))
      .slice(0, 3)
      .map((p, i) => ({ place: i + 1, name: p.name, gross: p.gross ?? 0, net: p.gross ?? 0, hc: 0 }));
  }, [grid, top3]);

  return (
    <div className="card grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">シェア用スクショ</h3>
        <div className="share-tools">
          <button className="btn-primary" onClick={captureTable}>テーブルをPNG保存</button>
          <button className="btn-primary btn-accent" onClick={captureCard}>シェアカードをPNG保存</button>
          <button className="btn-primary" onClick={() => setOpenPreview(v => !v)}>
            {openPreview ? 'プレビューを隠す' : 'プレビューを見る'}
          </button>
        </div>
      </div>

      {/* プレビュー（1200x630）。非表示でも生成は可能だが、確認用にトグル表示 */}
      {openPreview && (
        <div className="overflow-auto">
          <div className="share-card" ref={cardRef}>
            {/* Header */}
            <div className="share-head">
              <div>
                <div className="share-title">{current?.title ?? 'SW Invitational'}</div>
                <div className="share-sub">
                  {current?.dateLabel ?? ''}{current?.course ? ` ｜ ${current.course}` : ''}
                </div>
              </div>
              <div className="share-badges">
                <span className="share-badge">Leaderboard</span>
                <span className="share-badge">{current?.participants ? `${current.participants} Players` : 'Golf'}</span>
              </div>
            </div>

            {/* Body */}
            <div className="share-body">
              {/* Top3 */}
              <div className="share-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{width: '68px'}}>順位</th>
                      <th>名前</th>
                      <th style={{width: '100px'}}>Gross</th>
                      <th style={{width: '100px'}}>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {podium.map((r) => (
                      <tr key={r.place}>
                        <td>{r.place === 1 ? '優勝' : r.place === 2 ? '準優勝' : '3位'}</td>
                        <td style={{fontWeight: 700}}>{r.name}</td>
                        <td>{r.gross}</td>
                        <td>{r.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Awards (一部を抜粋表示) */}
              <div className="share-table">
                <table>
                  <thead>
                    <tr>
                      <th>表彰</th>
                      <th>名前</th>
                      <th style={{width: '80px'}}>Hole</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['ドラコン', 'ニアピン', 'ぴったり賞'].map((cat) => {
                      const a = awards.find(x => x.category === cat);
                      return (
                        <tr key={cat}>
                          <td>{cat}</td>
                          <td style={{fontWeight: 700}}>{a?.name ?? '-'}</td>
                          <td>{a?.hole ?? '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="share-footer">
              <div className="share-brand">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 16c3-1 6-1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>SW Invitational</span>
              </div>
              <div className="text-sm" style={{color:'rgba(0,0,0,.6)'}}>#Golf #SWInvitational</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
