import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ROLES } from "@domain/enums/roles";
import { ROLES as ROLETYPE } from "@domain/types/roles";
import z from "zod";

export const getUsersQueryValidationSchema = z.object({
  query: z.string().optional(),
  role: z
    .string()
    .transform((data) =>
      data
        .split(",")
        .filter((r) => Object.values(ROLES).includes(r as ROLETYPE)),
    )
    .optional(),
  status: z
    .string()
    .optional()
    .transform((v) =>
      v === "blocked" ? true : v === "active" ? false : undefined,
    ),
  pageNo: z.coerce.number(),
});

export const userStatusChangeValidationSchema = z.object({
  id: z.string({ error: INTERNAL_ERROR_MESSAGES.ID_MISSING }),
  status: z.boolean({ error: INTERNAL_ERROR_MESSAGES.STATUS_MISSING }),
});

export const getUnverifiedUserValidationSchema = z.object({
  role: z
    .string()
    .refine((val) => Object.values(ROLES).includes(val as ROLETYPE), {
      error: INTERNAL_ERROR_MESSAGES.INVALID_ROLE,
    }),
  pageNo: z.coerce.number({ error: INTERNAL_ERROR_MESSAGES.INVALID_PAGE_NO }),
  query: z.string().optional(),
});

export const rejectUserVerificationRequestValidationSchema = z.object({
  userId: z.string({ error: INTERNAL_ERROR_MESSAGES.ID_MISSING }),
  reason: z.string({ error: INTERNAL_ERROR_MESSAGES.REASON_MISSING }),
});
