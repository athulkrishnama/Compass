export interface IDeleteCabImageUseCase {
  execute(userId: string, index: number): Promise<void>;
}
