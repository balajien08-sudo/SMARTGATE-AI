import { Router } from 'express';
import { getProjectMethodology, updateFieldNumbers, uploadFieldPhoto, deleteFieldPhoto } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getProjectMethodology);
router.patch('/field-numbers', authenticateToken, updateFieldNumbers);
router.post('/photo', authenticateToken, uploadFieldPhoto);
router.delete('/photo', authenticateToken, deleteFieldPhoto);

export default router;

