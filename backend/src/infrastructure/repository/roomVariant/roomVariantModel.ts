import { model } from "mongoose";
import { roomVariantSchema, IRoomVariantDocument } from "./roomVariantSchema";

export const roomVariantModel = model<IRoomVariantDocument>(
  "roomVariant",
  roomVariantSchema,
);
