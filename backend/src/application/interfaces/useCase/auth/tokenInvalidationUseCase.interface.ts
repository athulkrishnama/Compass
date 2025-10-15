export interface ITokenInvalidationUseCase {
  validate(token: string): Promise<void>;
}
