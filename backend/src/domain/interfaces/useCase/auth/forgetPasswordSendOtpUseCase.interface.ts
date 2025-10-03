export interface IForgetPasswordSendOtpUseCase {
  sendOtp(email: string): Promise<void>;
}
