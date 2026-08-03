import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IAspectAverages } from "@domain/dtos/hotelReview/getHotelReviews.dto";

const ASPECT_KEYS: (keyof IAspectAverages)[] = [
  "hospitality",
  "staffFriendliness",
  "cleanliness",
  "comfort",
  "roomQuality",
  "safety",
];

export function computeAspectAverages(
  reviews: IHotelReviewWithReviewer[],
): IAspectAverages {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const review of reviews) {
    for (const key of ASPECT_KEYS) {
      const val = review.ratings?.[key];
      if (val !== undefined && val !== null) {
        sums[key] = (sums[key] ?? 0) + val;
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
  }

  const result: IAspectAverages = {};
  for (const key of ASPECT_KEYS) {
    if (counts[key]) {
      result[key] = Math.round((sums[key] / counts[key]) * 10) / 10;
    }
  }
  return result;
}
