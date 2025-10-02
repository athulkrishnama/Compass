import { IBaseRepository } from "@domain/interfaces/repository/base/base.repo.interface";
import { Model } from "mongoose";

export abstract class BaseRepository<T, Doc>
  implements IBaseRepository<T, Doc>
{
  constructor(protected _model: Model<Doc>) {}

  async create(data: T): Promise<string> {
    const { _id } = await this._model.create(data);
    return _id as string;
  }

  async deleteById(id: string): Promise<boolean> {
    const deletedDoc = await this._model.findByIdAndDelete(id);
    if (deletedDoc) return true;
    return false;
  }
}
