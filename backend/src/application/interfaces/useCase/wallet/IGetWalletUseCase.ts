import { IWalletResponseDTO } from "@domain/dtos/wallet/walletResponse.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface IGetWalletUseCase {
  execute(
    userId: string,
    ownerType?: SERVICE_TYPE,
  ): Promise<IWalletResponseDTO>;
}
