import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { Schema, Types } from "mongoose";

export interface IWalletDocument extends Document {
  _id: Types.ObjectId;
  ownerId: string;
  ownerType: SERVICE_TYPE;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const walletSchema = new Schema<IWalletDocument>({
  ownerId: { type: String, required: true },
  ownerType: {
    type: String,
    enum: Object.values(SERVICE_TYPE),
    required: true,
  },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

walletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });
