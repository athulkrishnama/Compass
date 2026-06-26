import { inject, injectable } from "tsyringe";
import { IGetWalletSummaryUseCase } from "@application/interfaces/useCase/wallet/IGetWalletSummaryUseCase";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { IWalletSummaryDTO } from "@domain/dtos/wallet/walletResponse.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

@injectable()
export class GetWalletSummaryUseCase implements IGetWalletSummaryUseCase {
  constructor(
    @inject("IWalletRepo") private _walletRepo: IWalletRepo,
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async execute(
    userId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<IWalletSummaryDTO> {
    let wallet = await this._walletRepo.findByOwner(userId, ownerType);

    if (!wallet) {
      await this._walletRepo.creditWallet(userId, ownerType, 0);
      wallet = await this._walletRepo.findByOwner(userId, ownerType);
    }

    const walletId = wallet?._id ?? "";

    const summary = await this._transactionRepo.getOwnerTransactionSummary(
      userId,
      ownerType,
    );

    return {
      walletId,
      ownerId: userId,
      ownerType,
      balance: wallet?.balance ?? 0,
      totalCredits: summary.totalCredits,
      totalDebits: summary.totalDebits,
      pendingAmount: summary.pendingAmount,
    };
  }
}
