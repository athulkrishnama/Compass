export interface ICreateIndentRequestDTO {
  roomVariantId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  traverlerId: string;
}

export interface ICreateIndentResponseDTO {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
}
