import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  vendorId: string;
  name: string;
  locationId: number;
  serviceCategoryIds: number[];
  isCompliant: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    vendorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    locationId: { type: Number, required: true },
    serviceCategoryIds: { type: [Number], required: true },
    isCompliant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);
export default Vendor;