// lib/supabase/client.ts
import { createBrowserClient as supabaseCreateBrowserClient } from '@supabase/ssr'

export const createBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  return supabaseCreateBrowserClient(url, key)
}
