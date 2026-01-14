import { ICreateHotelRequestDTO } from "@domain/dtos/hotel/createHotel.dto";
import { ICreateUserUseCase } from "@application/interfaces/useCase/hotel/createHotelUseCase.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import {
  ConflictException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { HotelMapper } from "@mappers/hotel.mapper";

@injectable()
export class CreateHotelUseCase implements ICreateUserUseCase {
  constructor(
    @inject("IHotelRepo") private _hotelRepository: IHotelRepo,
    @inject("IUserRepo") private _userRepository: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async execute(data: ICreateHotelRequestDTO): Promise<void> {
    const user = await this._userRepository.findById(data.userId);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const existingHotel = await this._hotelRepository.findHotelByName(
      data.name,
    );

    if (existingHotel) {
      throw new ConflictException(INTERNAL_ERROR_MESSAGES.HOTEL_ALREADY_EXISTS);
    }

    const coverImage = await this._storageService.upload(
      data.coverImage,
      `${StorageFolderNames.HOTEL_COVER_IMAGE}/${Date.now()}`,
    );

    const promises = data.images.map((img, i) =>
      this._storageService.upload(
        img,
        `${StorageFolderNames.HOTEL_IMAGE}/${Date.now()}-${i}`,
      ),
    );

    const images = await Promise.all(promises);

    const hotel = HotelMapper.toEntityFromCreateHotelDTO({
      ...data,
      coverImage,
      images,
    });

    await this._hotelRepository.create(hotel);
  }
}
