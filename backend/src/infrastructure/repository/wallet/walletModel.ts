import { model } from "mongoose";
import { IWalletDocument, walletSchema } from "./walletSchema";

export const walletModel = model<IWalletDocument>("Wallet", walletSchema);
