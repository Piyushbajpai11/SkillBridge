import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { applyToProject, getMyApplications } from '../controllers/applicationController.js';


const router = express.Router();

router.get('/my-applications', protect, getMyApplications);
router.post('/:projectId', protect, applyToProject);

export default router;