import { Router } from 'express';
import { getLiveTraffic, getTrafficAnalytics, getTrafficPrediction } from '../controllers/trafficController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/live', authenticateToken, getLiveTraffic);
router.get('/analytics', authenticateToken, getTrafficAnalytics);
router.get('/prediction', authenticateToken, getTrafficPrediction);

export default router;
