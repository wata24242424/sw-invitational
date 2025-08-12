export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { ENV } from '@/lib/env';

export async function POST(req: Request) {
  try {
    if (!ENV.ENABLE_GALLERY_MANAGE) return new NextResponse('Delete disabled', { status: 403 });
    const { url } = await req.json();
    if (!url) return new NextResponse('No url', { status: 400 });

    // Public URL からファイル名だけ抽出して削除
    const idx = url.lastIndexOf('/');
    const key = url.substring(idx + 1);
    const { error } = await supabaseService.storage.from(ENV.SUPABASE_BUCKET).remove([key]);
    if (error) throw error;

    return new NextResponse('ok');
  } catch (e: any) {
    return new NextResponse(e?.message || 'Failed', { status: 500 });
  }
}
