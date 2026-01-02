export interface IChangeEmailVerifyOtpRequestDTO {
  userId: string;
  otp: string;
}

export interface IChangeEmailVerifyOtpResponseDTO {
  token: string;
}

export interface IChangeEmailNewEmailRequestDTO {
  userId: string;
  newEmail: string;
  token: string;
}
