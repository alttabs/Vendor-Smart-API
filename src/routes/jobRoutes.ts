import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { validateJob } from '../middleware/jobValidator';
import { basicAuthMiddleware } from '../middleware/basicAuth';

const router = Router();
router.post('/', basicAuthMiddleware, validateJob, JobController.createJob);
router.get('/', basicAuthMiddleware, JobController.getAllJobs);
router.get('/:jobId', basicAuthMiddleware, JobController.getJobById);

export default router;
