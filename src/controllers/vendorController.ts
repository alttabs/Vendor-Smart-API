import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendorService';

export class VendorController {
  static async createVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorService = new VendorService(req.body);
      const vendor = await vendorService.addVendor();
      res.status(201).json(vendor);
    } catch (error) {
      next(error);
    }
  }

  static async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendors = await VendorService.fetchAllVendors();
      res.status(200).json(vendors);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorById(req: Request, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params;
      const vendor = await VendorService.fetchVendorById(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      res.status(200).json(vendor);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorsForJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;
      const vendors = await VendorService.fetchVendorsForJob(jobId);
      res.status(200).json(vendors);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorStats(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Accessing public /stats endpoint");

      const { locationId, serviceCategoryId } = req.query;

      if (!locationId || !serviceCategoryId) {
        return res.status(400).json({ message: 'locationId and serviceCategoryId are required' });
      }

      const stats = await VendorService.getVendorStats(
        Number(locationId),
        Number(serviceCategoryId)
      );

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
