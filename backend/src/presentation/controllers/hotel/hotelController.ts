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

@injectable()
export class HotelController {
  constructor(
    @inject("ICreateHotelUseCase")
    private _createHotelUseCase: ICreateHotelUseCase,
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
}
