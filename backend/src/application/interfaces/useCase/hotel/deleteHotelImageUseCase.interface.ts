export interface IDeleteHotelImageUseCase {
  execute(hotelId: string, userId: string, index: number): Promise<void>;
}
