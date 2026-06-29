import { IWalletSummaryDTO } from "@domain/dtos/wallet/walletResponse.dto";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

export interface IGetWalletSummaryUseCase {
  execute(userId: string, ownerType: SERVICE_TYPE): Promise<IWalletSummaryDTO>;
}
