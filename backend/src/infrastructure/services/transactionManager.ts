import { ITransactionManager } from "@application/interfaces/service/ITransactionManager";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";
import mongoose, { ClientSession } from "mongoose";
import { injectable } from "tsyringe";

@injectable()
export class TransactionManager implements ITransactionManager {
  async startSession(): Promise<IDbSession> {
    const session = await mongoose.startSession();
    return session as unknown as IDbSession;
  }

  startTransaction(session: IDbSession): void {
    const clientSession = session as unknown as ClientSession;
    clientSession.startTransaction();
  }

  async commitTransaction(session: IDbSession): Promise<void> {
    const clientSession = session as unknown as ClientSession;
    await clientSession.commitTransaction();
  }

  async abortTransaction(session: IDbSession): Promise<void> {
    const clientSession = session as unknown as ClientSession;
    await clientSession.abortTransaction();
  }

  endSession(session: IDbSession): void {
    const clientSession = session as unknown as ClientSession;
    clientSession.endSession();
  }

  async withTransaction<T>(
    session: IDbSession,
    fn: () => Promise<T>,
  ): Promise<T> {
    const clientSession = session as unknown as ClientSession;
    return await clientSession.withTransaction(fn);
  }
}
