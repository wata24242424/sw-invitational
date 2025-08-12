export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase';
import { ENV } from '@/lib/env';

export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .storage
      .from(ENV.SUPABASE_BUCKET)
      .list(undefined, { sortBy: { column: 'created_at', order: 'desc' } });
    if (error) throw error;

    const urls = (data || [])
      .filter((f) => f.id && f.name)
      .map((f) => supabasePublic.storage.from(ENV.SUPABASE_BUCKET).getPublicUrl(f.name).data.publicUrl);

    return NextResponse.json(urls);
  } catch (e: any) {
    return new NextResponse(e?.message || 'Failed', { status: 500 });
  }
}
