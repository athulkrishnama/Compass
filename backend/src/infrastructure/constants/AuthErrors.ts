export enum AuthError {
  INVALID_EMAIL = "Invalid email or email not provided",
  INVALID_PASSWORD = "Invalid Password",
  NO_FULLNAME = "You should provide a fullname",
  INVALID_ROLE = "Provided role is invalid",
  ADMIN_SIGNUP_ERROR = "Admin signup is not supported",
  NO_OTP = "OTP not provided",
  TOKEN_DATA_MISSING = "Token data is missing",
  INVALID_TOKEN_ERROR = "Invalid Token",
}
