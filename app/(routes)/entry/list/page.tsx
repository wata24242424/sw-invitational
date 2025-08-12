'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [rows, setRows] = useState<(string|number)[][]>([]);

  useEffect(() => { fetch('/api/entry').then(r => r.json()).then(setRows); }, []);

  function downloadCSV() {
    const header = ['名前','平均スコア','クルマ','ピックアップ','その他','timestamp'];
    const csv = [header, ...rows].map(r => r.map((c) => {
      const s = String(c ?? '');
      return (/[",\n]/.test(s)) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'entries.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">エントリー一覧</h1>
        <button className="btn-primary" onClick={downloadCSV}>CSVエクスポート</button>
      </div>
      <div className="overflow-x-auto card">
        <table className="table">
          <thead>
            <tr><th>名前</th><th>平均スコア</th><th>クルマ</th><th>ピックアップ</th><th>その他</th><th>timestamp</th></tr>
          </thead>
          <tbody>
            {rows.slice(1).map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (<td key={j}>{String(c ?? '')}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
