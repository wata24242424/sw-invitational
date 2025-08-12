export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { appendEntry, getAllEntries } from '@/lib/sheets';
import { EntrySchema } from '@/lib/types';

export async function GET() {
  try {
    const values = await getAllEntries();
    return NextResponse.json(values);
  } catch (e: any) {
    return new NextResponse(e?.message || 'Failed', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = EntrySchema.parse(json);
    await appendEntry(parsed);
    return new NextResponse('ok');
  } catch (e: any) {
    return new NextResponse(e?.message || 'Failed', { status: 400 });
  }
}
