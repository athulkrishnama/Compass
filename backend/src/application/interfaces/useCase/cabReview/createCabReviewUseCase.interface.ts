import { ICreateCabReviewDTO } from "@domain/dtos/cabReview/createCabReview.dto";

export interface ICreateCabReviewUseCase {
  execute(data: ICreateCabReviewDTO): Promise<void>;
}
