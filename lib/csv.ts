export function toCSV(rows: (string | number)[][], header?: string[]): string {
  const data = header ? [header, ...rows] : rows;
  return data
    .map((r) => r.map((c) => {
      const s = String(c ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }).join(','))
    .join('\n');
}
