export interface IDeleteRoomImageUseCase {
  execute(roomId: string, userId: string, index: number): Promise<void>;
}
