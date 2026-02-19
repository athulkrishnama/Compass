export interface IPricingService {
  calculateDynamicPrice(data: {
    roomVariantId: string;
    checkInDate: Date;
    checkOutDate: Date;
  }): Promise<{
    totalPrice: number;
    availableRooms: number;
    priceBreakdown: { date: Date; price: number }[];
  }>;
}
