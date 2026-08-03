import { inject, injectable } from "tsyringe";
import { IGetHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getHotelReviewsUseCase.interface";
import { IGetHotelReviewsResult } from "@domain/dtos/hotelReview/getHotelReviews.dto";
import { IHotelReviewRepo } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { computeAspectAverages } from "@utils/computeAspectAverages";

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
    const [{ reviews, total }, allResult, hotel] = await Promise.all([
      this._hotelReviewRepo.findByHotelId(hotelId, page, limit),
      this._hotelReviewRepo.findByHotelId(hotelId, 1, 10_000),
      this._hotelRepo.findById(hotelId),
    ]);

    const averageRating = hotel?.averageRating ?? 0;
    const aspectAverages = computeAspectAverages(allResult.reviews);

    return { reviews, total, averageRating, aspectAverages };
  }
}
