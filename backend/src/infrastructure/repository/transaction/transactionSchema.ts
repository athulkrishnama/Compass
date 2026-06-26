import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { Schema, Types } from "mongoose";

export interface ITransactionDocument extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  ownerType: SERVICE_TYPE;
  ownerId: string;
  paymentMethod?: PAYMENT_METHOD;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  type: TRANSACTION_TYPE;
  description?: string;
  createdAt?: Date;
}

export const transactionSchema = new Schema<ITransactionDocument>({
  bookingId: { type: String, required: true },
  ownerType: {
    type: String,
    enum: Object.values(SERVICE_TYPE),
    required: true,
  },
  ownerId: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
  },
  amount: { type: Number, required: true },
  commissionRate: { type: Number },
  commissionAmount: { type: Number },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPE),
    required: true,
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

transactionSchema.index({ ownerId: 1, ownerType: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ paymentMethod: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ bookingId: 1 });
