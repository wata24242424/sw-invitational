import Link from 'next/link';
import { getTournaments } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const all = await getTournaments();
  const past = all.filter((t) => !t.isCurrent);

  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-semibold">過去の大会</h1>
      {past.length === 0 ? (
        <div className="card text-sm text-black/60">まだ過去大会はありません。</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {past.map((t) => (
            <article key={t.slug} className="card">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-black/60 mt-1">
                {t.dateLabel ?? ''}{t.course ? ` ｜ ${t.course}` : ''}
              </div>
              <Link
                href={{ pathname: '/leaderboard', query: { t: t.slug } }}
                className="btn-primary mt-3 inline-flex"
              >
                詳細（リーダーボード）
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
