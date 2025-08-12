import { getResults } from '@/lib/sheets';
import type { ResultsRow } from '@/lib/types';

export default async function Page() {
  const rows: ResultsRow[] = await getResults();
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">最終結果</h1>
      <div className="overflow-x-auto card">
        <table className="table">
          <thead>
            <tr><th>順位</th><th>氏名</th><th>Gross</th><th>Net</th><th>HC</th></tr>
          </thead>
          <tbody>
            {rows.map((r: ResultsRow, i: number) => (
              <tr key={i}>
                <td>{r.place}</td>
                <td>{r.name}</td>
                <td>{r.gross}</td>
                <td>{r.net}</td>
                <td>{r.hc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-black/60">※ 結果は Sheets 側で手動更新を想定（ハンディ反映済）。</p>
    </section>
  );
}
