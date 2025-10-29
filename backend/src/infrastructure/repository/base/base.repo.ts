import { IBaseRepository } from "application/interfaces/repository/base/base.repo.interface";
import { Model, UpdateQuery } from "mongoose";

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

  async findById(id: string): Promise<T | null> {
    const user = await this._model.findById(id);
    if (user) {
      return this.toEntity(user);
    }
    return null;
  }

  async update(e: T, id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, e as UpdateQuery<Doc>);
  }

  abstract toEntity(doc: Doc): T;
}
