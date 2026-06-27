import { inject, injectable } from "tsyringe";
import { IGetDriverReviewsUseCase } from "@application/interfaces/useCase/cabReview/getDriverReviewsUseCase.interface";
import { IGetDriverReviewsResult } from "@domain/dtos/cabReview/getDriverReviews.dto";
import { ICabReviewRepo } from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";

@injectable()
export class GetDriverReviewsUseCase implements IGetDriverReviewsUseCase {
  constructor(
    @inject("ICabReviewRepo") private _cabReviewRepo: ICabReviewRepo,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
  ) {}

  async execute(
    driverUserId: string,
    page: number,
    limit: number,
  ): Promise<IGetDriverReviewsResult> {
    const cab = await this._cabRepo.findByUserId(driverUserId);
    const driverId = cab ? driverUserId : driverUserId;

    const { reviews, total } = await this._cabReviewRepo.findByDriverId(
      driverId,
      page,
      limit,
    );

    const averageRating = cab?.averageRating ?? 0;

    return { reviews, total, averageRating };
  }
}
