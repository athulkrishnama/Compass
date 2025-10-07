import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { IUserStatusChangeUseCase } from "@domain/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserStatusChangeUseCase implements IUserStatusChangeUseCase {
  constructor(@inject("IUserRepo") private _userRepo: IUserRepo) {}

  async change(id: string, status: boolean): Promise<void> {
    await this._userRepo.userStatusChange(id, status);
  }
}
