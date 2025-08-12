'use client';

import { useMemo, useState } from 'react';
import type { LeaderboardGrid } from '@/lib/types';
import { fmt, fmtDiff } from '@/components/num';

type Mode = 'all' | 'out' | 'in';

export default function ScoreTable({ grid }: { grid: LeaderboardGrid }) {
  const [mode, setMode] = useState<Mode>('all');

  const holes = useMemo(() => {
    if (mode === 'out') return Array.from({ length: 9 }, (_, i) => i + 1);
    if (mode === 'in')  return Array.from({ length: 9 }, (_, i) => i + 10);
    return Array.from({ length: 18 }, (_, i) => i + 1);
  }, [mode]);

  const parOut = grid.par.slice(0, 9).reduce((a, b) => (Number.isFinite(b) ? a + (b as number) : a), 0);
  const parIn  = grid.par.slice(9, 18).reduce((a, b) => (Number.isFinite(b) ? a + (b as number) : a), 0);
  const parTotal = parOut + parIn;

  return (
    <div className="card">
      {/* モバイル：OUT/IN/ALL 切替 */}
      <div className="md:hidden mb-3 flex items-center justify-between">
        <div className="text-sm text-black/60">表示ホール</div>
        <div className="segment">
          <button onClick={() => setMode('out')} aria-pressed={mode==='out'}>OUT</button>
          <button onClick={() => setMode('in')} aria-pressed={mode==='in'}>IN</button>
          <button onClick={() => setMode('all')} aria-pressed={mode==='all'}>ALL</button>
        </div>
      </div>

      <div className="edge-fade">
        <div className="scrollx">
          <table className="lb-table min-w-[720px] md:min-w-[920px] table-fixed">
            <thead className="sticky-head">
              <tr>
                <th className="lb-th sticky-col w-[160px]">Player</th>
                {holes.map((n) => (
                  <th key={`h${n}`} className="lb-th hole-col w-[44px]">{`H${n}`}</th>
                ))}
                <th className="lb-th hole-col w-[54px]">OUT</th>
                <th className="lb-th hole-col w-[54px]">IN</th>
                <th className="lb-th hole-col w-[72px]">Gross</th>
              </tr>
              <tr>
                <th className="lb-th sticky-col text-black/60">PAR</th>
                {holes.map((n) => {
                  const p = grid.par[n-1];
                  return <th key={`p${n}`} className="lb-th hole-col">{Number.isFinite(p) ? p : '-'}</th>;
                })}
                <th className="lb-th">{fmt(parOut)}</th>
                <th className="lb-th">{fmt(parIn)}</th>
                <th className="lb-th">{fmt(parTotal)}</th>
              </tr>
            </thead>
            <tbody>
              {grid.players.map((pl) => {
                return (
                  <tr key={pl.name}>
                    <td className="lb-td sticky-col text-left font-medium player-cell">{pl.name}</td>
                    {holes.map((n) => {
                      const s = pl.scores[n-1];
                      const par = grid.par[n-1];
                      const cls =
                        Number.isFinite(s) && Number.isFinite(par)
                          ? (s as number) < (par as number)
                            ? 'score-good'
                            : (s as number) === (par as number)
                              ? 'score-even'
                              : 'score-bad'
                          : '';
                      return (
                        <td key={`${pl.name}-${n}`} className={`lb-td hole-col ${cls}`}>
                          {fmt(s)}
                        </td>
                      );
                    })}
                    <td className="lb-td">{fmt(pl.out)}</td>
                    <td className="lb-td">{fmt(pl.in)}</td>
                    <td className="lb-td">
                      {fmt(pl.gross)}
                      {pl.gross != null && Number.isFinite(pl.gross) && (
                        <span className="ml-1 text-xs text-black/60">({fmtDiff(pl.gross, parTotal)})</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-2 text-xs text-black/60">
        ※ PARは1行目（B〜S列）に入力。モバイルはOUT/IN/ALLの切替で列数を減らせます。
      </p>
    </div>
  );
}
