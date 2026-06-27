import { inject, injectable } from "tsyringe";
import { IGetHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getHotelReviewsUseCase.interface";
import { IGetHotelReviewsResult } from "@domain/dtos/hotelReview/getHotelReviews.dto";
import { IHotelReviewRepo } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";

@injectable()
export class GetHotelReviewsUseCase implements IGetHotelReviewsUseCase {
  constructor(
    @inject("IHotelReviewRepo") private _hotelReviewRepo: IHotelReviewRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(
    hotelId: string,
    page: number,
    limit: number,
  ): Promise<IGetHotelReviewsResult> {
    const { reviews, total } = await this._hotelReviewRepo.findByHotelId(
      hotelId,
      page,
      limit,
    );

    const hotel = await this._hotelRepo.findById(hotelId);
    const averageRating = hotel?.averageRating ?? 0;

    return { reviews, total, averageRating };
  }
}
