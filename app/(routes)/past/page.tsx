import { getTournaments } from '@/lib/sheets';
import Link from 'next/link';

export const metadata = { title: '過去の大会 | SW Invitational' };

export default async function PastPage() {
  const all = await getTournaments();
  const past = all.filter(t => !t.isCurrent);

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">過去の大会</h1>
      {past.length === 0 ? (
        <div className="card text-sm text-black/60">まだ過去大会はありません。</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {past.map(t => (
            <article key={t.slug} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.thumbnail || 'https://images.unsplash.com/photo-1518609571773-39b7d303a87a?q=80&w=1200&auto=format&fit=crop'}
                alt={t.title}
                className="w-full h-40 object-cover rounded-xl border border-black/10"
              />
              <div className="mt-3">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-black/60 mt-1">
                  {t.dateLabel ?? ''}{t.course ? ` ・ ${t.course}` : ''}
                </div>
                <a href={`/past/${t.slug}`} className="btn-primary mt-3 inline-flex">詳細</a>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="text-sm text-black/60">※ 詳細ページは後で `/past/[slug]` を作成予定。</div>
    </section>
  );
}
