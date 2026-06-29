import { inject, injectable } from "tsyringe";
import { IGetAllHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getAllHotelReviewsUseCase.interface";
import { IGetAllHotelReviewsResult } from "@domain/dtos/hotelReview/getAllHotelReviews.dto";
import {
  IHotelReviewRepo,
  IHotelReviewFilters,
} from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

@injectable()
export class GetAllHotelReviewsUseCase implements IGetAllHotelReviewsUseCase {
  constructor(
    @inject("IHotelReviewRepo") private _hotelReviewRepo: IHotelReviewRepo,
  ) {}

  async execute(
    filters: IHotelReviewFilters,
    page: number,
    limit: number,
  ): Promise<IGetAllHotelReviewsResult> {
    return await this._hotelReviewRepo.findAll(filters, page, limit);
  }
}
