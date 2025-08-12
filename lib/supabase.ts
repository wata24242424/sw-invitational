import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

export const supabasePublic = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, { auth: { persistSession: false } });
export const supabaseService = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE, { auth: { persistSession: false } });
