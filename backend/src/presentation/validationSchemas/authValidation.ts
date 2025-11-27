import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ROLES } from "@domain/enums/roles";
import z from "zod";

export const userRegistrationSchema = z.object({
  email: z.email({ error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL }),
  password: z.string({ error: INTERNAL_ERROR_MESSAGES.INVALID_PASSWORD }),
  full_name: z.string({ error: INTERNAL_ERROR_MESSAGES.NO_FULLNAME }),
  role: z
    .enum(ROLES, {
      error: INTERNAL_ERROR_MESSAGES.INVALID_ROLE,
    })
    .refine((role) => role !== ROLES.ADMIN, {
      error: INTERNAL_ERROR_MESSAGES.ADMIN_SIGNUP_ERROR,
      path: ["role"],
    }),
});

export const userRegistrationVerifyOtpSchema = z.object({
  email: z.email({ error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL }),
  otp: z.string({ error: INTERNAL_ERROR_MESSAGES.NO_OTP }),
});

export const emailValidationSchema = z.email({
  error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL,
});

export const loginValidationSchema = z.object({
  email: z.email({ error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL }),
  password: z.string({ error: INTERNAL_ERROR_MESSAGES.INVALID_PASSWORD }),
});

export const forgetPasswordVerifyOtpSchema = z.object({
  email: z.email({ error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL }),
  otp: z.string({ error: INTERNAL_ERROR_MESSAGES.NO_OTP }),
});

export const forgetPasswordResetPasswordSchema = z.object({
  email: z.email({ error: INTERNAL_ERROR_MESSAGES.INVALID_EMAIL }),
  password: z.string({ error: INTERNAL_ERROR_MESSAGES.INVALID_PASSWORD }),
  token: z.string({ error: INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING }),
});

export const googleLoginSchema = z.object({
  authorizationCode: z.string({
    error: INTERNAL_ERROR_MESSAGES.AUTHROIZATION_CODE_MISSING,
  }),
  role: z
    .enum(ROLES, {
      error: INTERNAL_ERROR_MESSAGES.INVALID_ROLE,
    })
    .refine((role) => role !== ROLES.ADMIN, {
      error: INTERNAL_ERROR_MESSAGES.ADMIN_SIGNUP_ERROR,
    }),
});

export const userUpdateProfileSchema = z.object({
  id: z.string(),
  full_name: z.string().optional(),
  profile_image: z
    .file()
    .mime(["image/jpeg", "image/png", "image/webp", "image/svg+xml"])
    .max(1024 * 1024 * 2)
    .optional(),
  verification_id_image: z
    .file()
    .mime(["image/jpeg", "image/png", "image/webp", "image/svg+xml"])
    .max(1024 * 1024 * 2)
    .optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(INTERNAL_ERROR_MESSAGES.INVALID_PASSWORD),
  newPassword: z.string(INTERNAL_ERROR_MESSAGES.INVALID_PASSWORD),
});
