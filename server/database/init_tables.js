import { supabase } from './supabase.js';

/**
 * Verifies if required tables exist by performing a lightweight query.
 * If they do not exist, it will log a warning instructing the user to run the SQL script.
 */
export async function verifySupabaseTables() {
  if (!supabase) return;

  const tables = ['traffic_readings', 'ai_predictions', 'alerts', 'field_observations'];
  let missingTables = [];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    // Code 42P01 means 'undefined_table' in Postgres/PostgREST
    if (error && error.code === '42P01') {
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.warn(`\n⚠️ Missing Supabase Tables: ${missingTables.join(', ')}`);
    console.warn(`Please run the SQL script found in 'server/database/schema.sql' in your Supabase SQL Editor.\n`);
  } else {
    console.log('✅ All Supabase tables verified.');
  }
}
