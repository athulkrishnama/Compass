import { model } from "mongoose";
import { ICabReviewDocument, cabReviewSchema } from "./cabReviewSchema";

export const cabReviewModel = model<ICabReviewDocument>(
  "cabreviews",
  cabReviewSchema,
);
