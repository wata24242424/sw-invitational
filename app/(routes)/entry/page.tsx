'use client';
import { useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setMsg('');
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      avg: Number(form.get('avg') || 0),
      hasCar: (form.get('hasCar') === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
      pickup: String(form.get('pickup') || ''),
      note: String(form.get('note') || ''),
    };
    const res = await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (!res.ok) { setMsg('送信に失敗しました'); return; }
    (e.target as HTMLFormElement).reset();
    setMsg('送信しました！');
  }

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">エントリー</h1>
      <form onSubmit={onSubmit} className="card grid gap-3 max-w-xl">
        <div>
          <label>名前</label>
          <input name="name" required />
        </div>
        <div>
          <label>平均スコア</label>
          <input name="avg" type="number" min={0} step={1} />
        </div>
        <div>
          <label>クルマ</label>
          <select name="hasCar">
            <option value="no">なし</option>
            <option value="yes">あり</option>
          </select>
        </div>
        <div>
          <label>ピックアップしてほしい場所</label>
          <input name="pickup" />
        </div>
        <div>
          <label>その他</label>
          <textarea name="note" rows={3} />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary btn-accent" disabled={loading}>
            {loading ? '送信中…' : '送信'}
          </button>
          {msg && <span className="text-sm text-black/70">{msg}</span>}
        </div>
      </form>
    </section>
  );
}
