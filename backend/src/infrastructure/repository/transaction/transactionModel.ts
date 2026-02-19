import { model } from "mongoose";
import { ITransactionDocument, transactionSchema } from "./transactionSchema";

export const transactionModel = model<ITransactionDocument>(
  "Transaction",
  transactionSchema,
);
