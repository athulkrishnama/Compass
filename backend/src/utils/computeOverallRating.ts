import { IReviewAspectRatings } from "@domain/entities/hotelReview/hotelReview.entity";

export function computeOverallRating(ratings: IReviewAspectRatings): number {
  const values = Object.values(ratings).filter(
    (v): v is number => v !== undefined && v !== null,
  );
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / values.length) * 10) / 10;
}
