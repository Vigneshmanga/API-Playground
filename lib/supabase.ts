import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase environment variables!\n' +
    'Please create a .env.local file in my-app/ with:\n\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your_project_url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key\n\n' +
    'Get these from: https://supabase.com/dashboard → Project Settings → API'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Type for API keys table (matches your Supabase schema)
export interface ApiKeyRow {
  id: string;
  name: string;
  value: string;  // The actual API key
  created_at: string;
  usage: number;
  usage_limit: number;
}

