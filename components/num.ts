export function fmt(n: unknown, fallback: string = '-') {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? String(v) : fallback;
}
export function fmtDiff(gross: unknown, parTotal: unknown) {
  const g = typeof gross === 'number' ? gross : Number(gross);
  const p = typeof parTotal === 'number' ? parTotal : Number(parTotal);
  if (!Number.isFinite(g) || !Number.isFinite(p)) return '';
  const d = g - p;
  if (d === 0) return 'E';
  return d > 0 ? `+${d}` : `${d}`;
}
