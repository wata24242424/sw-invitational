import { getPairings } from '@/lib/sheets';
import type { PairingRow } from '@/lib/types';

export default async function Page() {
  const data: PairingRow[] = await getPairings();
  const groups: string[] = Array.from(new Set(data.map((d: PairingRow) => `${d.hole}-${d.group}`)));

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">組み合わせ</h1>
      {groups.map((g: string) => {
        const [hole, group] = g.split('-');
        const rows = data.filter((d: PairingRow) => `${d.hole}-${d.group}` === g);
        return (
          <div className="card" key={g}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{hole} – Group {group}</h2>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="table">
                <thead>
                  <tr><th>氏名</th><th>HC</th></tr>
                </thead>
                <tbody>
                  {rows.map((r: PairingRow, i: number) => (
                    <tr key={`${g}-${i}`}><td>{r.name}</td><td>{r.hc ?? '-'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
