import { WalletEntity } from "@domain/entities/wallet/wallet.entity";
import { BaseRepository } from "../base/base.repo";
import { IWalletDocument } from "./walletSchema";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { inject, injectable } from "tsyringe";
import { ClientSession, Model } from "mongoose";

@injectable()
export class WalletRepo
  extends BaseRepository<WalletEntity, IWalletDocument>
  implements IWalletRepo
{
  constructor(@inject("IWalletModel") model: Model<IWalletDocument>) {
    super(model);
  }

  async findByOwner(
    ownerId: string,
    ownerType: SERVICE_TYPE,
  ): Promise<WalletEntity | null> {
    const doc = await this._model.findOne({ ownerId, ownerType });
    if (doc) {
      return this.toEntity(doc);
    }
    return null;
  }

  async creditWallet(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.findOneAndUpdate(
      { ownerId, ownerType },
      {
        $inc: { balance: amount },
        $setOnInsert: { ownerId, ownerType, createdAt: new Date() },
        $set: { updatedAt: new Date() },
      },
      { upsert: true, session },
    );
  }

  async debitWallet(
    ownerId: string,
    ownerType: SERVICE_TYPE,
    amount: number,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.findOneAndUpdate(
      { ownerId, ownerType },
      {
        $inc: { balance: -amount },
        $setOnInsert: { ownerId, ownerType, createdAt: new Date() },
        $set: { updatedAt: new Date() },
      },
      { upsert: true, session },
    );
  }

  toEntity(doc: IWalletDocument): WalletEntity {
    return {
      _id: doc._id.toString(),
      ownerId: doc.ownerId,
      ownerType: doc.ownerType,
      balance: doc.balance,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
