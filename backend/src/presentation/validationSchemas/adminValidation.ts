import { ROLES } from "@domain/constants/roles";
import { ROLES as ROLETYPE } from "@domain/types/roles";
import { ValidationErrors } from "presentation/constants/validationErrors";
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
      v === "true" ? true : v === "false" ? false : undefined,
    ),
  pageNo: z.coerce.number(),
});

export const userStatusChangeValidationSchema = z.object({
  id: z.string({ error: ValidationErrors.ID_MISSING }),
  status: z.boolean({ error: ValidationErrors.STATUS_MISSING }),
});
