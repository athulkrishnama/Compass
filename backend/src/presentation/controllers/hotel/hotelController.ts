import { InvalideDataException } from "@application/constants/Exceptions";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { createHotelValidation } from "@presentation/validationSchemas/hotelValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateHotelUseCase } from "@application/interfaces/useCase/hotel/createHotelUseCase.interface";
import { IGetHotelsByUserIdUseCase } from "@application/interfaces/useCase/hotel/getHotelsByUserIdUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class HotelController {
  constructor(
    @inject("ICreateHotelUseCase")
    private _createHotelUseCase: ICreateHotelUseCase,
    @inject("IGetHotelsByUserIdUseCase")
    private _getHotelsByUserIdUseCase: IGetHotelsByUserIdUseCase,
  ) {}

  async handleCreateHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;

      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : undefined;

      const data = createHotelValidation.safeParse({
        ...req.body,
        userId: id,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createHotelUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.CREATED,
        Messages.HOTEL_CREATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetHotelsByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.user;

      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const hotels = await this._getHotelsByUserIdUseCase.execute(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.HOTEL_FETCHED,
        hotels,
      );
    } catch (error) {
      next(error);
    }
  }
}
