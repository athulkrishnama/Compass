export interface RoomLockEntity {
  _id?: string;
  roomVariantId: string;
  travelerId: string;
  numberOfRooms: number;
  checkinDate: Date;
  checkoutDate: Date;
  amount: number;
  expiresAt: Date;
  paymentIntentId: string;
}
