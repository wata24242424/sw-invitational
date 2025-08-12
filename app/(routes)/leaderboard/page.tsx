import { getLeaderboard } from '@/lib/sheets';
import type { LeaderboardRow } from '@/lib/types';

export default async function Page() {
  const rows: LeaderboardRow[] = await getLeaderboard();
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">リーダーボード（進行）</h1>
      <div className="overflow-x-auto card">
        <table className="table">
          <thead>
            <tr><th>氏名</th><th>Gross</th><th>Net</th><th>Thru</th></tr>
          </thead>
          <tbody>
            {rows.map((r: LeaderboardRow, i: number) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.gross}</td>
                <td>{r.net ?? '-'}</td>
                <td>{r.thru ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
