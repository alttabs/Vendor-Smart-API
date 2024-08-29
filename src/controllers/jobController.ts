import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/jobService';

export class JobController {
  static async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobService = new JobService(req.body);
      const job = await jobService.addJob();
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  }

  static async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await JobService.fetchAllJobs();
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const job = await JobService.fetchJobById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }
}
