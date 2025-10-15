export interface IForgetPasswordVerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface IForgetPasswordResetPasswordRequestDTO {
  email: string;
  token: string;
  password: string;
}
