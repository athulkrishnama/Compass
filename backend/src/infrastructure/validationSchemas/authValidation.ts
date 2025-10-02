import { ROLES } from "@domain/constants/roles";
import { AuthError } from "@infrastructure/constants/AuthErrors";
import z from "zod";

export const userRegistrationSchema = z.object({
  email: z.email({ error: AuthError.INVALID_EMAIL }),
  password: z.string({ error: AuthError.INVALID_PASSWORD }),
  full_name: z.string({ error: AuthError.NO_FULLNAME }),
  role: z
    .enum(ROLES, {
      error: AuthError.INVALID_ROLE,
    })
    .refine((role) => role !== ROLES.ADMIN, {
      error: AuthError.ADMIN_SIGNUP_ERROR,
      path: ["role"],
    }),
});
