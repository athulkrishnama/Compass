export interface IDeleteRoomVariantImageUseCase {
  execute(roomVariantId: string, userId: string, index: number): Promise<void>;
}
