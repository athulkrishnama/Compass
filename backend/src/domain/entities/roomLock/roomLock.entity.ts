export interface RoomLockEntity {
  _id?: string;
  roomVariantId: string;
  checkinDate: Date;
  checkoutDate: Date;
  expiresAt: Date;
}
