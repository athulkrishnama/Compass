import { InvalideDataException } from "@application/constants/Exceptions";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  createHotelValidation,
  editHotelValidationSchema,
  hotelSearchValidationSchema,
} from "@presentation/validationSchemas/hotelValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateHotelUseCase } from "@application/interfaces/useCase/hotel/createHotelUseCase.interface";
import { IGetHotelsByUserIdUseCase } from "@application/interfaces/useCase/hotel/getHotelsByUserIdUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { IEditHotelUseCase } from "@application/interfaces/useCase/hotel/editHotelUseCase.interface";
import { IGetHotelByIdUseCase } from "@application/interfaces/useCase/hotel/getHotelByIdUseCase.interface";
import { IDeleteHotelImageUseCase } from "@application/interfaces/useCase/hotel/deleteHotelImageUseCase.interface";
import { IHotelSearchUseCase } from "@application/interfaces/useCase/hotel/hotelSearchUseCase.interface";

@injectable()
export class HotelController {
  constructor(
    @inject("ICreateHotelUseCase")
    private _createHotelUseCase: ICreateHotelUseCase,
    @inject("IGetHotelsByUserIdUseCase")
    private _getHotelsByUserIdUseCase: IGetHotelsByUserIdUseCase,
    @inject("IEditHotelUseCase")
    private _editHotelUseCase: IEditHotelUseCase,
    @inject("IGetHotelByIdUseCase")
    private _getHotelByIdUseCase: IGetHotelByIdUseCase,
    @inject("IDeleteHotelImageUseCase")
    private _deleteHotelImageUseCase: IDeleteHotelImageUseCase,
    @inject("IHotelSearchUseCase")
    private _hotelSearchUseCase: IHotelSearchUseCase,
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

  async handleEditHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;

      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : undefined;

      const data = editHotelValidationSchema.safeParse({
        ...req.body,
        id: req.params.id,
        userId: id,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._editHotelUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.HOTEL_EDITED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetHotelById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const hotel = await this._getHotelByIdUseCase.execute(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.HOTEL_FETCHED,
        hotel,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteHotelImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.user;
      const { id: hotelId, index } = req.params;

      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      if (isNaN(+index)) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_INDEX);
      }

      await this._deleteHotelImageUseCase.execute(hotelId, id, +index);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.HOTEL_IMAGE_DELETED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleHotelSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const data = hotelSearchValidationSchema.safeParse(req.query);

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      const result = await this._hotelSearchUseCase.search(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.HOTEL_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}
