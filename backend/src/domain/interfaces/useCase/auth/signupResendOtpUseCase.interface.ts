export interface ISignupResendOtpUsecase {
  resend(email: string): Promise<void>;
}
