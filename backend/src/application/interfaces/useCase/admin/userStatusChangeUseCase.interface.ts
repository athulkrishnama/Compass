export interface IUserStatusChangeUseCase {
  change(id: string, status: boolean): Promise<void>;
}
