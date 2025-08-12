'use client';
export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-sm">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={`inline-block w-10 h-6 rounded-full transition ${checked ? 'bg-[--accent]' : 'bg-black/20'}`}>
        <span className={`block w-5 h-5 bg-white rounded-full translate-x-0.5 mt-0.5 transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </label>
  );
}
