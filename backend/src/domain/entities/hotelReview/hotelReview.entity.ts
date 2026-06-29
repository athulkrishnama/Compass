export interface HotelReviewEntity {
  _id?: string;
  bookingId: string;
  hotelId: string;
  reviewerId: string;
  rating: number;
  review: string;
  createdAt?: Date;
  updatedAt?: Date;
}
