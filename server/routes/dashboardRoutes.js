import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getDashboardOverview);

export default router;
