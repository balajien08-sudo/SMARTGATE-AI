import express from 'express';
import { testSupabaseServerConnection, SUPABASE_URL } from '../database/supabase.js';

const router = express.Router();

/**
 * GET /api/supabase/status
 * Returns current Supabase connection health, project URL and latency
 */
router.get('/status', async (req, res) => {
  try {
    const diagnostic = await testSupabaseServerConnection();
    res.json({
      connected: diagnostic.success,
      projectUrl: SUPABASE_URL,
      latencyMs: diagnostic.latency,
      message: diagnostic.message,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      connected: false,
      projectUrl: SUPABASE_URL,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
