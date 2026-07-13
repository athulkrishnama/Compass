export interface ICreatePaymentIntentRequestDTO {
    roomVariantId: string;
    checkInDate: Date;
    checkOutDate: Date;
    guests: number;
    numberOfRooms: number;
}
