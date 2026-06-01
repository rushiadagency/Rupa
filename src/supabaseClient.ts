import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://xkqcdntxoblgmphtjefu.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZMhStpNs6IOG6htfmvrd1w_XVVM1NYK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

