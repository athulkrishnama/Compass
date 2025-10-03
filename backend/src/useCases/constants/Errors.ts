export enum AuthError {
  AUTH_EXISTING_EMAIL_ERROR = "User existing with same email",
  OTP_EXPIRED_OR_NOT_REQUESTED = "OTP is expired or otp not requested",
  INVALID_OTP = "OTP is invalid",
  USER_DATA_MISSIING_IN_CACHE = "User data is missing from cache",
  USER_NOT_FOUND = "User not found with this email",
  USER_IS_BLOCKED = "User is blocked",
  PASSWORD_NOT_MATCHING = "Password not matching",
}
