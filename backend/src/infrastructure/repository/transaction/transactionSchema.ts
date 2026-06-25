import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { Schema, Types } from "mongoose";

export interface ITransactionDocument extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  userId?: string;
  driverId?: string;
  serviceType: SERVICE_TYPE;
  providerId: string;
  paymentMethod?: PAYMENT_METHOD;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  providerAmount?: number;
  type: TRANSACTION_TYPE;
  description?: string;
  createdAt?: Date;
}

export const transactionSchema = new Schema<ITransactionDocument>({
  bookingId: { type: String, required: true },
  userId: { type: String },
  driverId: { type: String },
  serviceType: {
    type: String,
    enum: Object.values(SERVICE_TYPE),
    required: true,
  },
  providerId: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
  },
  amount: { type: Number, required: true },
  commissionRate: { type: Number },
  commissionAmount: { type: Number },
  providerAmount: { type: Number },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPE),
    required: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});
