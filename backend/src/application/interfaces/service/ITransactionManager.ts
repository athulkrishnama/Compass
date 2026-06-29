import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

export interface ITransactionManager {
  startSession(): Promise<IDbSession>;
  startTransaction(session: IDbSession): void;
  commitTransaction(session: IDbSession): Promise<void>;
  abortTransaction(session: IDbSession): Promise<void>;
  endSession(session: IDbSession): void;
  withTransaction<T>(session: IDbSession, fn: () => Promise<T>): Promise<T>;
}
