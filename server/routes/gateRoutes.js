import { Router } from 'express';
import { getGates, updateGateStatus, getGateLogs } from '../controllers/gateController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getGates);
router.patch('/:id', authenticateToken, updateGateStatus);
router.get('/logs', authenticateToken, getGateLogs);

export default router;
