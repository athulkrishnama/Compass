export interface ITopUpWalletUseCase {
  execute(
    userId: string,
    amount: number,
  ): Promise<{ clientSecret: string; paymentIntentId: string }>;
}
