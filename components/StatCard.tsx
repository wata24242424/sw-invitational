export function StatCard({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-black/60">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-black/60 text-sm">{sub}</div>}
    </div>
  );
}
