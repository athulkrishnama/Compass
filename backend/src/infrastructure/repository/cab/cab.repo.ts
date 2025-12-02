import { CabEntity } from "@domain/entities/user/cab.entity";
import { BaseRepository } from "../base/base.repo";
import { ICabDocument } from "../database configs/schemas/cabSchema";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";

@injectable()
export class CabRepo
  extends BaseRepository<CabEntity, ICabDocument>
  implements ICabRepo
{
  constructor(@inject("ICabModel") protected _model: Model<ICabDocument>) {
    super(_model);
  }

  async findByUserId(userId: string): Promise<CabEntity | null> {
    const cab = await this._model.findOne({ userId });
    if (cab) {
      return this.toEntity(cab);
    }
    return null;
  }

  toEntity(doc: ICabDocument): CabEntity {
    return {
      _id: doc._id.toString(),
      userId: doc.userId,
      isOnline: doc.isOnline,
      vehicleDetails: doc.vehicleDetails,
      baseLocation: doc.baseLocation,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
