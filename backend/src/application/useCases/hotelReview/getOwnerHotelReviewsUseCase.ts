import { inject, injectable } from "tsyringe";
import { IGetOwnerHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getOwnerHotelReviewsUseCase.interface";
import { IGetOwnerHotelReviewsResult } from "@domain/dtos/hotelReview/getOwnerHotelReviews.dto";
import { IHotelReviewRepo } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { computeAspectAverages } from "@utils/computeAspectAverages";

@injectable()
export class GetOwnerHotelReviewsUseCase
  implements IGetOwnerHotelReviewsUseCase
{
  constructor(
    @inject("IHotelReviewRepo") private _hotelReviewRepo: IHotelReviewRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IGetOwnerHotelReviewsResult> {
    const { hotels } = await this._hotelRepo.getHotelsByUserId(userId);
    const hotelIds = hotels.map((h) => h._id!);

    if (hotelIds.length === 0) {
      return { reviews: [], total: 0, aspectAverages: {} };
    }

    const [pagedResult, allResult] = await Promise.all([
      this._hotelReviewRepo.findByOwnerHotelIds(hotelIds, page, limit),
      this._hotelReviewRepo.findByOwnerHotelIds(hotelIds, 1, 10_000),
    ]);

    const aspectAverages = computeAspectAverages(allResult.reviews);

    return { ...pagedResult, aspectAverages };
  }
}
