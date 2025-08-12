export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseService, supabasePublic } from '@/lib/supabase';
import { ENV } from '@/lib/env';

type FileObject = {
  name: string;
  id?: string | null;
  metadata?: { mimetype?: string } | null;
};

async function listAll(prefix = ''): Promise<string[]> {
  // 再帰的にフォルダ探索してフルパス配列を返す
  const { data, error } = await supabaseService
    .storage
    .from(ENV.SUPABASE_BUCKET)
    .list(prefix || undefined, {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) throw error;

  const entries = (data || []) as FileObject[];

  const files: string[] = [];
  for (const e of entries) {
    const isFolder = !e.id && !e.metadata?.mimetype; // フォルダ判定（id無し & mimetype無し想定）
    const path = prefix ? `${prefix}/${e.name}` : e.name;

    if (isFolder) {
      // サブフォルダを再帰的に探索
      const sub = await listAll(path);
      files.push(...sub);
    } else {
      files.push(path);
    }
  }
  return files;
}

export async function GET() {
  try {
    // すべてのファイルパス（サブフォルダ含む）を取得
    const paths = await listAll('');

    // Public URL に変換（バケットは Public 前提）
    const urls = paths.map(
      (p) => supabasePublic.storage.from(ENV.SUPABASE_BUCKET).getPublicUrl(p).data.publicUrl
    );

    return NextResponse.json(urls);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new NextResponse(msg, { status: 500 });
  }
}
