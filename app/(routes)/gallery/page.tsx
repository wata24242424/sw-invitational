'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [urls, setUrls] = useState<string[]>([]);
  const canUpload = process.env.NEXT_PUBLIC_ENABLE_GALLERY_UPLOAD === '1';
  const canManage = process.env.NEXT_PUBLIC_ENABLE_GALLERY_MANAGE === '1';

  useEffect(() => { fetch('/api/gallery').then(r => r.json()).then(setUrls); }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set('file', file);
    const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd });
    if (!res.ok) { alert('Upload disabled or failed'); return; }
    const url = await res.text();
    setUrls((u) => [url, ...u]);
  }

  async function onDelete(u: string) {
    const res = await fetch('/api/gallery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: u })
    });
    if (!res.ok) { alert('Delete disabled or failed'); return; }
    setUrls((list) => list.filter((x) => x !== u));
  }

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">ギャラリー</h1>
      {canUpload && (
        <div className="card">
          <label className="block">画像アップロード</label>
          <input type="file" accept="image/*" onChange={onUpload} />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {urls.map((u) => (
          <figure key={u} className="relative group border rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="gallery" className="w-full h-40 object-cover" />
            {canManage && (
              <button onClick={() => onDelete(u)} className="absolute top-2 right-2 btn-primary bg-white/90">削除</button>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
