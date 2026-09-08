import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://dyqguxhhgbcvyijfqjsp.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_QwID_qVPGzZ9RX5uTekhJA_j9SXjNW9';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Perform a live ping and diagnostic check against Supabase
 * @returns {Promise<{success: boolean, latencyMs: number, message: string, details?: any}>}
 */
export async function testSupabaseConnection() {
  const startTime = performance.now();
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (sessionError) {
      return {
        success: false,
        latencyMs,
        message: `Supabase Auth Check Failed: ${sessionError.message}`
      };
    }

    return {
      success: true,
      latencyMs,
      message: 'Successfully connected to Supabase Cloud infrastructure',
      projectUrl: SUPABASE_URL,
      sessionActive: !!sessionData?.session
    };
  } catch (err) {
    const endTime = performance.now();
    return {
      success: false,
      latencyMs: Math.round(endTime - startTime),
      message: err.message || 'Unable to establish connection to Supabase endpoint'
    };
  }
}

/**
 * Sign in using Supabase Auth
 */
export async function signInWithSupabase(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Sign up using Supabase Auth
 */
export async function signUpWithSupabase(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutWithSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current Supabase Session
 */
export async function getSupabaseSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Real-time channel subscription helper
 */
export function subscribeToSupabaseChannel(channelName, table, event = '*', callback) {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event, schema: 'public', table },
      (payload) => callback(payload)
    )
    .subscribe();
}
