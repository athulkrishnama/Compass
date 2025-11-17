import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { IUserStatusChangeUseCase } from "application/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserStatusChangeUseCase implements IUserStatusChangeUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ICacheService") private _cacheStorage: ICacheService,
  ) {}

  async change(id: string, status: boolean): Promise<void> {
    await this._userRepo.userStatusChange(id, status);
    this._cacheStorage.deleteValue(`USER_STATUS:${id}`);
  }
}
