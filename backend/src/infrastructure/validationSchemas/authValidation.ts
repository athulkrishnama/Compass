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

export const userRegistrationVerifyOtpSchema = z.object({
  email: z.email({ error: AuthError.INVALID_EMAIL }),
  otp: z.string({ error: AuthError.NO_OTP }),
});

export const emailValidationSchema = z.email({
  error: AuthError.INVALID_EMAIL,
});

export const loginValidationSchema = z.object({
  email: z.email({ error: AuthError.INVALID_EMAIL }),
  password: z.string({ error: AuthError.INVALID_PASSWORD }),
});

export const forgetPasswordVerifyOtpSchema = z.object({
  email: z.email({ error: AuthError.INVALID_EMAIL }),
  otp: z.string({ error: AuthError.NO_OTP }),
});

export const forgetPasswordResetPasswordSchema = z.object({
  email: z.email({ error: AuthError.INVALID_EMAIL }),
  password: z.string({ error: AuthError.INVALID_PASSWORD }),
  token: z.string({ error: AuthError.TOKEN_DATA_MISSING }),
});
