import { z } from "zod";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

export const walletTransactionsQueryValidationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional(),
  sort: z
    .enum(["latest", "oldest", "highestAmount", "lowestAmount"])
    .optional(),
  type: z.nativeEnum(TRANSACTION_TYPE).optional(),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD).optional(),
  serviceType: z.nativeEnum(SERVICE_TYPE).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minAmount: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxAmount: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
});

export const adminTransactionsQueryValidationSchema =
  walletTransactionsQueryValidationSchema;
