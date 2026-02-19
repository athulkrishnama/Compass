import { IWalletResponseDTO } from "@domain/dtos/wallet/walletResponse.dto";

export interface IGetWalletUseCase {
  execute(userId: string): Promise<IWalletResponseDTO>;
}
