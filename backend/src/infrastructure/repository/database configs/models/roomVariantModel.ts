import { model } from "mongoose";
import {
  roomVariantSchema,
  IRoomVariantDocument,
} from "../schemas/roomVariantSchema";

export const roomVariantModel = model<IRoomVariantDocument>(
  "roomVariant",
  roomVariantSchema,
);
