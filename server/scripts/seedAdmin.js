import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('dyqguxhhgbcvyijfqjsp')) {
  console.error('❌ ERROR: You are still using the dummy Supabase URL.');
  console.error('Please update your server/.env with your REAL Supabase Project URL and Key.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedAdmin() {
  console.log(`🔌 Connecting to Supabase at ${SUPABASE_URL}...`);
  
  const email = 'balajien08@gmail.com';
  const password = '3329';
  const name = 'BALAJI EN';
  const role = 'Administrator';

  try {
    // Attempt to register the admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log('✅ Admin user already exists in your Supabase project!');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Successfully saved the Admin account to Supabase!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log('You can now log in using the One-Click Demo Access button on the frontend.');
    }
  } catch (err) {
    console.error('❌ Failed to create admin user:', err.message);
  }
}

seedAdmin();
