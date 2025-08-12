// app/(routes)/leaderboard/page.tsx
import {
  getTournaments,
  getCurrentTournament,
  getLeaderboardGridFor,
  getAwardsFor,
  getResultsFor,
} from '@/lib/sheets';
import ScoreTable from '@/components/ScoreTable';
import ShareShot from '@/components/ShareShot';
import BoardAnalytics from '@/components/BoardAnalytics';
import LeaderboardSwitcher from '@/components/LeaderboardSwitcher';

export const dynamic = 'force-dynamic';

export default async function Page(
  props: { searchParams: Promise<Record<string, string | string[] | undefined>> }
) {
  // Next.js 15 の typed searchParams は Promise なので await 必須
  const sp = await props.searchParams;
  const all = await getTournaments();

  // 並び：isCurrent → その他
  const options = [
    ...all.filter(a => a.isCurrent),
    ...all.filter(a => !a.isCurrent),
  ];

  const activeSlug = (sp.t as string) || options[0]?.slug;
  const active = all.find(t => t.slug === activeSlug) || (await getCurrentTournament());

  const [grid, awards, results] = await Promise.all([
    getLeaderboardGridFor(active?.slug),
    getAwardsFor(active?.slug).catch(() => []),
    getResultsFor(active?.slug).catch(() => []),
  ]);

  const top3 = results
    .slice()
    .sort((a, b) => a.place - b.place)
    .filter((r) => r.place >= 1 && r.place <= 3)
    .slice(0, 3);

  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold">Leaderboard & Analytics</h1>
          <LeaderboardSwitcher items={options.map(o => ({ slug: o.slug, title: o.title }))} />
        </div>
        {active && (
          <p className="text-sm text-black/60">
            {active.dateLabel ?? ''}{active.course ? ` ｜ ${active.course}` : ''}{active.address ? ` ｜ ${active.address}` : ''}
          </p>
        )}
      </header>

      {/* テーブル（PNG保存対象） */}
      <div id="lbArea">
        <ScoreTable grid={grid} />
      </div>

      {/* アナリティクス */}
      <BoardAnalytics grid={grid} results={results} awards={awards} />

      {/* シェアPNG */}
      <ShareShot current={active || null} grid={grid} top3={top3} awards={awards} />
    </section>
  );
}
