import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { UserRepository } from "@infrastructure/repository/users/user.repo";
import { container } from "tsyringe";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { CabRepo } from "@infrastructure/repository/cab/cab.repo";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { DestinationRepo } from "@infrastructure/repository/destination/destination.repo";

export function registerRepositories() {
  container.registerSingleton<IUserRepo>("IUserRepo", UserRepository);
  container.registerSingleton<ICabRepo>("ICabRepo", CabRepo);
  container.registerSingleton<IDestinationRepo>(
    "IDestinationRepo",
    DestinationRepo,
  );
}
