import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import z from "zod";

export const getDestinationValidationSchema = z.object({
  pageNo: z.coerce.number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
  queryString: z.string().optional(),
  type: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.array(z.enum(DESTINATION_TYPES)).optional(),
  ),
  activities: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.array(z.enum(ACTIVITY_TYPE)).optional(),
  ),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  city: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z.tuple([z.number(), z.number()]).optional(),
  ),
  proximityRadius: z.coerce.number().optional(),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : undefined),
    z.boolean().optional(),
  ),
  onlyFree: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : undefined),
    z.boolean().optional(),
  ),
  isWheelchairAccessible: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : undefined),
    z.boolean().optional(),
  ),
  sortBy: z.enum(["name", "entryFee"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
});
