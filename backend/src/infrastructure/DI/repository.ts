import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { UserRepository } from "@infrastructure/repository/users/user.repo";
import { container } from "tsyringe";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { CabRepo } from "@infrastructure/repository/cab/cab.repo";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { DestinationRepo } from "@infrastructure/repository/destination/destination.repo";
import { HotelRepo } from "@infrastructure/repository/hotel/hotel.repo";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { RoomVariantRepo } from "@infrastructure/repository/roomVariant/roomVariant.repo";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { RoomRepo } from "@infrastructure/repository/room/roomRepo";

export function registerRepositories() {
  container.registerSingleton<IUserRepo>("IUserRepo", UserRepository);
  container.registerSingleton<ICabRepo>("ICabRepo", CabRepo);
  container.registerSingleton<IDestinationRepo>(
    "IDestinationRepo",
    DestinationRepo,
  );
  container.registerSingleton<IHotelRepo>("IHotelRepo", HotelRepo);
  container.registerSingleton<IRoomVariantRepo>(
    "IRoomVariantRepo",
    RoomVariantRepo,
  );
  container.registerSingleton<IRoomRepo>("IRoomRepo", RoomRepo);
}
