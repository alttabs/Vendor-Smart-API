import { Router } from 'express';
import { VendorController } from '../controllers/vendorController';
import { validateVendor } from '../middleware/vendorValidator';
import { basicAuthMiddleware } from '../middleware/basicAuth';

const router = Router();

//public route
router.get('/stats', VendorController.getVendorStats);

router.post('/', basicAuthMiddleware, validateVendor, VendorController.createVendor);
router.get('/', basicAuthMiddleware, VendorController.getAllVendors);
router.get('/:vendorId', basicAuthMiddleware, VendorController.getVendorById);
router.get('/job/:jobId', basicAuthMiddleware, VendorController.getVendorsForJob);

export default router;
