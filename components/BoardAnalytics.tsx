'use client';

import { useMemo } from 'react';
import type { Award, LeaderboardGrid, ResultsRow } from '@/lib/types';
import { fmt } from '@/components/num';

function mean(nums: number[]) {
  return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : NaN;
}

export default function BoardAnalytics({
  grid,
  results,
  awards,
}: {
  grid: LeaderboardGrid;
  results: ResultsRow[];
  awards: Award[];
}) {
  const completed = grid.players.filter((p) => Number.isFinite(p.gross));
  const grossList = completed.map((p) => p.gross as number);
  const avgGross = mean(grossList);
  const bestGross = grossList.length ? Math.min(...grossList) : NaN;
  const worstGross = grossList.length ? Math.max(...grossList) : NaN;
  const parTotal = grid.par.reduce((a, b) => (Number.isFinite(b) ? a + (b as number) : a), 0);

  const top3 = useMemo(() => {
    if (results.length) {
      return results
        .slice()
        .sort((a, b) => a.place - b.place)
        .filter((r) => r.place >= 1 && r.place <= 3)
        .slice(0, 3);
    }
    return completed
      .slice()
      .sort((a, b) => a.gross! - b.gross!)
      .slice(0, 3)
      .map((p, i) => ({ place: i + 1, name: p.name, gross: p.gross!, net: p.gross!, hc: 0 }));
  }, [results, completed]);

  const holeStats = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const vals = completed
        .map((p) => p.scores[i])
        .filter((v): v is number => Number.isFinite(v as number));
      const avg = mean(vals);
      const par = grid.par[i];
      const delta =
        Number.isFinite(par) && Number.isFinite(avg)
          ? Math.round(((avg as number) - (par as number)) * 10) / 10
          : NaN;
      return { hole: i + 1, par, avg, delta };
    });
  }, [completed, grid.par]);

  const netRank = useMemo(() => {
    const withNet = results.filter((r) => Number.isFinite(r.net));
    return withNet.slice().sort((a, b) => a.net - b.net).slice(0, 10);
  }, [results]);

  return (
    <section className="grid gap-6">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">参加人数</div>
          <div className="kpi-value">{fmt(grid.players.length)}</div>
          <div className="kpi-sub">うち集計完了 {fmt(completed.length)} 名</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">平均Gross</div>
          <div className="kpi-value">{Number.isFinite(avgGross) ? avgGross : '-'}</div>
          <div className="kpi-sub">Par {fmt(parTotal)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">ベスト / ワースト</div>
          <div className="kpi-value">
            {Number.isFinite(bestGross) ? bestGross : '-'}
            <span className="text-black/60 text-base"> / </span>
            {Number.isFinite(worstGross) ? worstGross : '-'}
          </div>
          <div className="kpi-sub">
            {Number.isFinite(bestGross) && (
              <span className="badge">
                Best{' '}
                {(() => {
                  const d = (bestGross as number) - (parTotal as number);
                  return d === 0 ? 'E' : d > 0 ? `+${d}` : `${d}`;
                })()}
              </span>
            )}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">完了率</div>
          <div className="kpi-value">
            {grid.players.length ? Math.round((completed.length / grid.players.length) * 100) + '%' : '-'}
          </div>
          <div className="kpi-sub">Gross入力済の割合</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h2 className="sec-title">ホール別アベレージ</h2>
          <div className="sec-sub">バーの高さ＝Parからの差（±）。0に近いほど易しい。</div>
        </div>
        <div className="holes-wrap">
          <div className="holes-bars">
            {holeStats.map((h) => {
              const delta = h.delta;
              const abs = Number.isFinite(delta) ? Math.min(1.5, Math.abs(delta as number)) : 0;
              const bg = Number.isFinite(delta)
                ? (delta as number) <= 0
                  ? 'linear-gradient(180deg, #9ad3ac 0%, #cfeada 100%)'
                  : 'linear-gradient(180deg, #f6b4b4 0%, #fde1e1 100%)'
                : 'linear-gradient(#f0f0f0,#f0f0f0)';
              return (
                <div key={h.hole} className="hole-bar">
                  <div
                    className="hole-fill"
                    style={{ background: bg, opacity: abs ? 0.6 + abs / 3 : 0.4 }}
                  />
                  <b>H{h.hole}</b>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="text-xs text-black/60">緑：平均がPar以下</div>
            <div className="text-xs text-black/60">赤：平均がParより難しい</div>
            <div className="text-xs text-black/60">高さ：差の大きさ</div>
          </div>
        </div>
      </div>

      {netRank.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="sec-title">NET ランキング（Top10）</h2>
            <div className="sec-sub">results シートの Net/HC を使用</div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-compact">
              <thead>
                <tr>
                  <th>順位</th>
                  <th>名前</th>
                  <th>Gross</th>
                  <th>HC</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {netRank.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{fmt(r.gross)}</td>
                    <td>{fmt(r.hc)}</td>
                    <td>{fmt(r.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {top3.map((r) => (
          <div key={r.place} className="card">
            <div className="text-xs uppercase tracking-wide text-black/60">
              {r.place === 1 ? '優勝' : r.place === 2 ? '準優勝' : '3位'}
            </div>
            <div className="mt-2 text-xl font-semibold">{r.name}</div>
            <div className="mt-1 text-sm text-black/70">
              Gross {fmt(r.gross)} / Net {fmt(r.net)} / HC {fmt(r.hc)}
            </div>
          </div>
        ))}
        {['ドラコン', 'ニアピン', 'ぴったり賞'].map((cat) => {
          const list = awards.filter((a) => a.category === cat);
          return (
            <div key={cat} className="card">
              <div className="text-xs uppercase tracking-wide text-black/60">{cat}</div>
              {list.length === 0 ? (
                <div className="mt-2 text-sm text-black/60">該当なし</div>
              ) : (
                <ul className="mt-2 text-sm space-y-1">
                  {list.map((a, i) => (
                    <li key={i}>
                      <span className="font-medium">{a.name}</span>
                      {a.hole && <span className="text-black/60">（H{a.hole}）</span>}
                      {a.note && <span className="text-black/60"> – {a.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
