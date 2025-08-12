export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseService, supabasePublic } from '@/lib/supabase';
import { ENV } from '@/lib/env';

export async function POST(req: Request) {
  try {
    if (!ENV.ENABLE_GALLERY_UPLOAD) {
      return new NextResponse('Upload disabled', { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return new NextResponse('No file', { status: 400 });
    }

    const key = `${Date.now()}_${file.name}`;
    const { error } = await supabaseService
      .storage
      .from(ENV.SUPABASE_BUCKET)
      .upload(key, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabasePublic.storage.from(ENV.SUPABASE_BUCKET).getPublicUrl(key);
    return new NextResponse(data.publicUrl, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new NextResponse(msg, { status: 500 });
  }
}
