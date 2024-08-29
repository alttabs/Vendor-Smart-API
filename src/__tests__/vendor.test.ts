import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Vendor from '../models/vendor';
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

describe('Vendor Model Test', () => {
  it('should create and save a vendor successfully', async () => {
    const validVendor = new Vendor({
      vendorId: 'v123',
      name: 'Test Vendor',
      locationId: 10,
      serviceCategoryIds: [2, 4],
      isCompliant: true,
    });

    const savedVendor = await validVendor.save();

    expect(savedVendor._id).toBeDefined();
    expect(savedVendor.vendorId).toBe('v123');
    expect(savedVendor.name).toBe('Test Vendor');
    expect(savedVendor.locationId).toBe(10);
    expect(savedVendor.serviceCategoryIds).toEqual([2, 4]);
    expect(savedVendor.isCompliant).toBe(true);
  });

  it('should fail to create a vendor without required fields', async () => {
    const invalidVendor = new Vendor({
      vendorId: 'v124',

    });

    let err;
    try {
      await invalidVendor.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);

    if (err.errors.name) {
      expect(err.errors.name.message).toBe('Path `name` is required.');
    }
    if (err.errors.locationId) {
      expect(err.errors.locationId.message).toBe('Path `locationId` is required.');
    }
    if (err.errors.serviceCategoryIds) {
      expect(err.errors.serviceCategoryIds.message).toBe('Path `serviceCategoryIds` is required.');
    }
  });

  it('should prevent duplicate vendorId', async () => {
    const vendor1 = new Vendor({
      vendorId: 'v126',
      name: 'Vendor 1',
      locationId: 10,
      serviceCategoryIds: [2, 4],
      isCompliant: true,
    });

    const vendor2 = new Vendor({
      vendorId: 'v126',
      name: 'Vendor 2',
      locationId: 11,
      serviceCategoryIds: [3],
      isCompliant: true,
    });

    await vendor1.save();

    let err: { code: any; };
    try {
      await vendor2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.mongo.MongoServerError);
    expect(err.code).toBe(11000);
  });
});
