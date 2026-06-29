import { inject, injectable } from "tsyringe";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";

import { ITopUpWalletUseCase } from "@application/interfaces/useCase/wallet/ITopUpWalletUseCase";

@injectable()
export class TopUpWalletUseCase implements ITopUpWalletUseCase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
  ) {}

  async execute(
    userId: string,
    amount: number,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const metadata = {
      serviceType: "WALLET_TOP_UP",
      userId,
      amount: amount.toString(),
    };

    const paymentIntent = await this._paymentService.createPaymentIntent(
      amount,
      metadata,
    );

    return paymentIntent;
  }
}
