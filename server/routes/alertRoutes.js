import { Router } from 'express';
import { getAlerts, updateAlertStatus, createAlert } from '../controllers/alertController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getAlerts);
router.patch('/:id', authenticateToken, updateAlertStatus);
router.post('/', authenticateToken, createAlert);

export default router;
