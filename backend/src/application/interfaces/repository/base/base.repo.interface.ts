export interface IBaseRepository<T, Doc> {
  create(data: T): Promise<string>;
  deleteById(id: string): Promise<boolean>;
  findById?(data: T): Promise<Doc>;
}
