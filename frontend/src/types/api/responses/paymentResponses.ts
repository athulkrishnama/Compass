export interface ICreatePaymentIntentResponseDTO {
    paymentIntentId: string;
    clientSecret: string;
    amount: number;
}
