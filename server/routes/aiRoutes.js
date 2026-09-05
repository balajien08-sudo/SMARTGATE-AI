import { Router } from 'express';
import { getAiInsights, chatWithAssistant } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/insights', authenticateToken, getAiInsights);
router.post('/chat', authenticateToken, chatWithAssistant);

export default router;
