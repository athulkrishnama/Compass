export interface RoomLockEntity {
  _id?: string;
  roomVariantId: string;
  checkinDate: Date;
  checkoutDate: Date;
  amount: number;
  expiresAt: Date;
  paymentIntentId: string;
}
