import { Router } from 'express';
import jobRoutes from './jobRoutes';
import vendorRoutes from './vendorRoutes';

const router = Router();
router.use('/jobs', jobRoutes);
router.use('/vendors', vendorRoutes);

export default router;
