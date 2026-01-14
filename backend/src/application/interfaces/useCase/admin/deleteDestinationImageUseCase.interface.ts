export interface IDeleteDestinationImageUseCase {
  execute(id: string, index: number): Promise<void>;
}
