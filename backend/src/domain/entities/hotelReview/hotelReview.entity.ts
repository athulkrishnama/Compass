export interface IReviewAspectRatings {
  hospitality?: number; // 1-5
  staffFriendliness?: number;
  cleanliness?: number;
  comfort?: number;
  roomQuality?: number;
  safety?: number;
}

export interface HotelReviewEntity {
  _id?: string;
  bookingId: string;
  hotelId: string;
  reviewerId: string;
  ratings: IReviewAspectRatings;
  comment?: string;
  overallRating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
