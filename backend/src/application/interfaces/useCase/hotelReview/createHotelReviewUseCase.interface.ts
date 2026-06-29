import { ICreateHotelReviewDTO } from "@domain/dtos/hotelReview/createHotelReview.dto";

export interface ICreateHotelReviewUseCase {
  execute(data: ICreateHotelReviewDTO): Promise<void>;
}
