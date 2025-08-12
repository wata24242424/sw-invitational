export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { appendEntry, getAllEntries } from '@/lib/sheets';
import { z } from 'zod';

const EntrySchema = z.object({
  name: z.string().min(1),
  avg: z.number().nonnegative().default(0),
  hasCar: z.enum(['yes', 'no']).default('no'),
  pickup: z.string().default(''),
  note: z.string().default(''),
});
type EntryPayload = z.infer<typeof EntrySchema>;

export async function GET() {
  try {
    const values = await getAllEntries();
    return NextResponse.json(values);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new NextResponse(msg, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown;
    const parsed: EntryPayload = EntrySchema.parse(json);
    await appendEntry(parsed);
    return new NextResponse('ok');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new NextResponse(msg, { status: 400 });
  }
}
