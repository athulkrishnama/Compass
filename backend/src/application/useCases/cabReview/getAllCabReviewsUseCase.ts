import { inject, injectable } from "tsyringe";
import { IGetAllCabReviewsUseCase } from "@application/interfaces/useCase/cabReview/getAllCabReviewsUseCase.interface";
import { IGetAllCabReviewsResult } from "@domain/dtos/cabReview/getAllCabReviews.dto";
import {
  ICabReviewRepo,
  ICabReviewFilters,
} from "@application/interfaces/repository/cabReview/cabReview.repo.interface";

@injectable()
export class GetAllCabReviewsUseCase implements IGetAllCabReviewsUseCase {
  constructor(
    @inject("ICabReviewRepo") private _cabReviewRepo: ICabReviewRepo,
  ) {}

  async execute(
    filters: ICabReviewFilters,
    page: number,
    limit: number,
  ): Promise<IGetAllCabReviewsResult> {
    return await this._cabReviewRepo.findAll(filters, page, limit);
  }
}
