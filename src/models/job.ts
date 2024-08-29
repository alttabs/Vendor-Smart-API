import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  jobId: string;
  locationId: number;
  serviceCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true, unique: true },
    locationId: { type: Number, required: true },
    serviceCategoryId: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
