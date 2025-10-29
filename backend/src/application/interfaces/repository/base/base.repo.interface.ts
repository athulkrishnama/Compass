export interface IBaseRepository<T, Doc> {
  create(data: T): Promise<string>;
  deleteById(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  toEntity(doc: Doc): T;
  update(e: T, id: string): Promise<void>;
}
