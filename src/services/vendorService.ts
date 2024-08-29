import VendorModel, { IVendor } from '../models/vendor';
import JobModel from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config';

export class VendorService {
  vendorId: string;
  name: string;
  locationId: number;
  serviceCategoryIds: number[];
  isCompliant: boolean;

  constructor({ name, locationId, serviceCategoryIds, isCompliant }: Partial<IVendor>) {
    this.vendorId = uuidv4();
    this.name = name?.trim() || '';
    this.locationId = locationId || 0;
    this.serviceCategoryIds = serviceCategoryIds || [];
    this.isCompliant = isCompliant || false;
  }

  async addVendor(): Promise<IVendor> {
    try {
      logger.info(`Adding new vendor: ${this.name}`);
      const newVendor = new VendorModel({ ...this });
      await newVendor.save();
      logger.info(`Vendor added successfully with ID: ${this.vendorId}`);
      return newVendor;
    } catch (error) {
      logger.error(`Failed to add vendor: ${error.message}`);
      throw error;
    }
  }

  static async fetchAllVendors(): Promise<IVendor[]> {
    try {
      logger.info('Fetching all vendors');
      const vendors = await VendorModel.find();
      logger.info(`Total vendors fetched: ${vendors.length}`);
      return vendors;
    } catch (error) {
      logger.error(`Failed to fetch vendors: ${error.message}`);
      throw error;
    }
  }

  static async fetchVendorById(vendorId: string): Promise<IVendor | null> {
    try {
      logger.info(`Fetching vendor with ID: ${vendorId}`);
      const vendor = await VendorModel.findOne({ vendorId });
      if (vendor) {
        logger.info(`Vendor found: ${vendor.name}`);
      } else {
        logger.warn(`Vendor not found with ID: ${vendorId}`);
      }
      return vendor;
    } catch (error) {
      logger.error(`Failed to fetch vendor: ${error.message}`);
      throw error;
    }
  }

  static async fetchVendorsForJob(jobId: string): Promise<IVendor[]> {
    try {
      logger.info(`Fetching vendors for job ID: ${jobId}`);
      const job = await JobModel.findOne({ jobId });
      if (!job) {
        logger.error(`Job not found with ID: ${jobId}`);
        throw new Error('Job not found');
      }

      const vendors = await VendorModel.find({
        locationId: job.locationId,
        serviceCategoryIds: { $in: [job.serviceCategoryId] },
      }).sort({ isCompliant: -1 });

      logger.info(`Found ${vendors.length} vendors for job ID: ${jobId}`);
      return vendors;
    } catch (error) {
      logger.error(`Failed to fetch vendors for job ID ${jobId}: ${error.message}`);
      throw error;
    }
  }

  static async fetchVendorCounts(locationId: number, serviceCategoryId: number) {
    try {
      logger.info(`Counting vendors for location ID: ${locationId}, service category ID: ${serviceCategoryId}`);

      const totalVendors = await VendorModel.countDocuments({
        locationId,
        serviceCategoryIds: { $in: [serviceCategoryId] },
      });

      const compliantVendors = await VendorModel.countDocuments({
        locationId,
        serviceCategoryIds: { $in: [serviceCategoryId] },
        isCompliant: true,
      });

      const counts = {
        total: totalVendors,
        compliant: compliantVendors,
        notCompliant: totalVendors - compliantVendors,
      };

      logger.info(`Vendor counts - Total: ${counts.total}, Compliant: ${counts.compliant}, Not Compliant: ${counts.notCompliant}`);
      return counts;
    } catch (error) {
      logger.error(`Failed to count vendors: ${error.message}`);
      throw error;
    }
  }

  static async getVendorStats(locationId: number, serviceCategoryId: number) {
    try {
      logger.info(`Calculating vendor stats for location ID: ${locationId}, service category ID: ${serviceCategoryId}`);

      const totalVendors = await VendorModel.countDocuments({
        locationId,
        serviceCategoryIds: { $in: [serviceCategoryId] },
      });

      const compliantVendors = await VendorModel.countDocuments({
        locationId,
        serviceCategoryIds: { $in: [serviceCategoryId] },
        isCompliant: true,
      });

      const notCompliantVendors = totalVendors - compliantVendors;

      return {
        total: totalVendors,
        compliant: compliantVendors,
        notCompliant: notCompliantVendors,
      };
    } catch (error) {
      logger.error(`Failed to calculate vendor stats: ${error.message}`);
      throw error;
    }
  }
}
