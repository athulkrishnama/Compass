import { inject, injectable } from "tsyringe";
import { IGetWalletUseCase } from "@application/interfaces/useCase/wallet/IGetWalletUseCase";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { IWalletResponseDTO } from "@domain/dtos/wallet/walletResponse.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(@inject("IWalletRepo") private _walletRepo: IWalletRepo) {}

  async execute(
    userId: string,
    ownerType: SERVICE_TYPE = SERVICE_TYPE.HOTEL,
  ): Promise<IWalletResponseDTO> {
    let wallet = await this._walletRepo.findByOwner(userId, ownerType);

    if (!wallet) {
      await this._walletRepo.creditWallet(userId, ownerType, 0);
      wallet = await this._walletRepo.findByOwner(userId, ownerType);
    }

    return {
      balance: wallet?.balance ?? 0,
    };
  }
}
