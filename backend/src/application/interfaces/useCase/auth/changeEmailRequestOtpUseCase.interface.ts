export interface IChangeEmailRequestOtpUseCase {
  execute(userId: string): Promise<void>;
}
