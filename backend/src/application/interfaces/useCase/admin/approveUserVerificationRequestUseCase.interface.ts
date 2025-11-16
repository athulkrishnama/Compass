export interface IApproveUserVerificationRequestUseCase {
  approve(id: string): Promise<void>;
}
