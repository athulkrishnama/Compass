import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { UserRepository } from "@infrastructure/repository/users/user.repo";
import { container } from "tsyringe";

export function registerRepositories() {
  container.registerSingleton<IUserRepo>("IUserRepo", UserRepository);
}
