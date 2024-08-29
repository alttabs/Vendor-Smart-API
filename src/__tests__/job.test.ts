import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Job from '../models/job';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Job Model Test', () => {
  it('should create and save a job successfully', async () => {
    const validJob = new Job({
      jobId: 'j123',
      locationId: 10,
      serviceCategoryId: 4,
    });

    const savedJob = await validJob.save();

    expect(savedJob._id).toBeDefined();
    expect(savedJob.jobId).toBe('j123');
    expect(savedJob.locationId).toBe(10);
    expect(savedJob.serviceCategoryId).toBe(4);
  });

  it('should fail to create a job without required fields', async () => {
    const invalidJob = new Job({
      jobId: 'j124',
    });

    let err;
    try {
      await invalidJob.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.locationId).toBeDefined();
    expect(err.errors.serviceCategoryId).toBeDefined();
  });

  it('should allow updating a job\'s service category', async () => {
    const job = new Job({
      jobId: 'j125',
      locationId: 10,
      serviceCategoryId: 3,
    });

    await job.save();

    job.serviceCategoryId = 2;
    const updatedJob = await job.save();

    expect(updatedJob.serviceCategoryId).toBe(2);
  });

  it('should prevent duplicate jobId', async () => {
    const job1 = new Job({
      jobId: 'j126',
      locationId: 10,
      serviceCategoryId: 2,
    });

    const job2 = new Job({
      jobId: 'j126',
      locationId: 11,
      serviceCategoryId: 3,
    });

    await job1.save();

    let err;
    try {
      await job2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.mongo.MongoServerError);
    expect(err.code).toBe(11000);
  });

});
