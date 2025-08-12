import { ReactNode } from 'react';
export default function DotBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-golf-dots" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
