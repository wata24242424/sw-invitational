import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ゴルフ豆知識 | SW Invitational',
};

const tips = [
  {
    title: '風の読み方',
    content: '旗や木の揺れ方を見て風向きを把握し、クラブ選択に活かしましょう。',
  },
  {
    title: 'グリーンの傾斜',
    content: 'カップ周辺の芝目と傾斜を読むことで、パットの成功率が上がります。',
  },
  {
    title: '朝露の影響',
    content: '早朝ラウンドでは芝が濡れているため、ボールの転がりが遅くなります。',
  },
];

export default function TipsPage() {
  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">ゴルフ豆知識</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, idx) => (
          <div key={idx} className="card">
            <h2 className="text-lg font-semibold">{tip.title}</h2>
            <p className="mt-2 text-sm text-muted">{tip.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
