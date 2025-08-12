// app/(routes)/page.tsx
import { getCurrentTournament, getTournaments } from '@/lib/sheets';
import TopClient from './top-client';

export default async function Page() {
  const current = await getCurrentTournament();
  const all = await getTournaments();
  const past = all.filter(t => !t.isCurrent);

  return <TopClient current={current} past={past} />;
}
// app/(routes)/page.tsx
export const revalidate = 300; // 5分

