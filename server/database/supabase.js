import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dyqguxhhgbcvyijfqjsp.supabase.co';
export const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_QwID_qVPGzZ9RX5uTekhJA_j9SXjNW9';

let supabaseClient = null;

export function getSupabase() {
  if (!supabaseClient && SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
        realtime: {
          transport: ws
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (err) {
      console.warn('⚠️ Supabase client initialization warning:', err.message);
    }
  }
  return supabaseClient;
}

export const supabase = getSupabase();

/**
 * Diagnostic test for server-to-Supabase connectivity
 */
export async function testSupabaseServerConnection() {
  const start = Date.now();
  try {
    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase client not initialized' };
    }
    const { data, error } = await client.auth.getSession();
    const latency = Date.now() - start;
    if (error) {
      return { success: false, latency, message: error.message };
    }
    return {
      success: true,
      latency,
      projectUrl: SUPABASE_URL,
      message: 'Server successfully connected to Supabase Cloud API'
    };
  } catch (err) {
    return {
      success: false,
      latency: Date.now() - start,
      message: err.message
    };
  }
}
