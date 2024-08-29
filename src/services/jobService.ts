import JobModel, { IJob } from '../models/job';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config';

export class JobService {
  jobId: string;
  locationId: number;
  serviceCategoryId: number;

  constructor({ locationId, serviceCategoryId }: Partial<IJob>) {
    this.jobId = uuidv4();
    this.locationId = locationId || 0;
    this.serviceCategoryId = serviceCategoryId || 0;
  }

  async addJob(): Promise<IJob> {
    try {
      logger.info(`Adding new job for location ID: ${this.locationId} and service category ID: ${this.serviceCategoryId}`);
      const newJob = new JobModel({ ...this });
      await newJob.save();
      logger.info(`Job added successfully with ID: ${this.jobId}`);
      return newJob;
    } catch (error) {
      logger.error(`Failed to add job: ${error.message}`);
      throw error;
    }
  }

  static async fetchAllJobs(): Promise<IJob[]> {
    try {
      logger.info('Fetching all jobs');
      const jobs = await JobModel.find();
      logger.info(`Total jobs fetched: ${jobs.length}`);
      return jobs;
    } catch (error) {
      logger.error(`Failed to fetch jobs: ${error.message}`);
      throw error;
    }
  }

  static async fetchJobById(jobId: string): Promise<IJob | null> {
    try {
      logger.info(`Fetching job with ID: ${jobId}`);
      const job = await JobModel.findOne({ jobId });
      if (job) {
        logger.info(`Job found with ID: ${jobId}`);
      } else {
        logger.warn(`Job not found with ID: ${jobId}`);
      }
      return job;
    } catch (error) {
      logger.error(`Failed to fetch job: ${error.message}`);
      throw error;
    }
  }
}
