export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { ENV } from '@/lib/env';

type DeleteBody = { url?: string };

export async function POST(req: Request) {
  try {
    if (!ENV.ENABLE_GALLERY_MANAGE) {
      return new NextResponse('Delete disabled', { status: 403 });
    }

    const body = (await req.json()) as DeleteBody;
    if (!body.url) return new NextResponse('No url', { status: 400 });

    // URLの末尾をキーとして抽出（フォルダ運用時は改善余地あり）
    const idx = body.url.lastIndexOf('/');
    const key = body.url.substring(idx + 1);

    const { error } = await supabaseService.storage.from(ENV.SUPABASE_BUCKET).remove([key]);
    if (error) throw error;

    return new NextResponse('ok');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new NextResponse(msg, { status: 500 });
  }
}
