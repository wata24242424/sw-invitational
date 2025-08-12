import { getPairings } from '@/lib/sheets';

type PairingLike = {
  hole: 'OUT' | 'IN';
  group: string;
  name: string;
  hc?: number;
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  // lib 側の戻りをローカル型にアサート（中心化したいなら types.ts を直して戻してOK）
  const data = (await getPairings()) as unknown as PairingLike[];

  const groups = Array.from(new Set(data.map((d) => `${d.hole}-${d.group}`)));

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">組み合わせ</h1>
      {groups.map((g) => {
        const [hole, group] = g.split('-');
        const rows = data.filter((d) => `${d.hole}-${d.group}` === g);
        return (
          <div className="rounded-2xl border border-black/10 p-5 shadow-sm" key={g}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{hole} – Group {group}</h2>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr><th className="text-left font-semibold py-2 border-b">氏名</th><th className="text-left font-semibold py-2 border-b">HC</th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${g}-${i}`}>
                      <td className="py-2 border-b">{r.name}</td>
                      <td className="py-2 border-b">{r.hc ?? '-'}</td>
                    </tr>
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
