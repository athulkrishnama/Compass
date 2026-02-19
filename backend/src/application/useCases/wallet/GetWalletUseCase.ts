import { inject, injectable } from "tsyringe";
import { IGetWalletUseCase } from "@application/interfaces/useCase/wallet/IGetWalletUseCase";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IWalletResponseDTO } from "@domain/dtos/wallet/walletResponse.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject("IWalletRepo") private _walletRepo: IWalletRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(userId: string): Promise<IWalletResponseDTO> {
    let wallet = await this._walletRepo.findByOwner(userId, SERVICE_TYPE.HOTEL);

    if (!wallet) {
      await this._walletRepo.creditWallet(userId, SERVICE_TYPE.HOTEL, 0);
      wallet = await this._walletRepo.findByOwner(userId, SERVICE_TYPE.HOTEL);
    }

    return {
      balance: wallet?.balance || 0,
    };
  }
}
