import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  createRoomVariantValidation,
  editRoomVariantValidation,
  getRoomAvailabilityValidation,
} from "@presentation/validationSchemas/roomVariantValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/createRoomVariantUseCase.interface";
import { IListRoomVariantsByHotelIdUseCase } from "@application/interfaces/useCase/roomVariant/listRoomVariantsByHotelIdUseCase.interface";
import { IEditRoomVariantUseCase } from "@application/interfaces/useCase/roomVariant/editRoomVariantUseCase.interface";
import { IGetRoomVariantByIdUseCase } from "@application/interfaces/useCase/roomVariant/getRoomVariantByIdUseCase.interface";
import { IDeleteRoomVariantImageUseCase } from "@application/interfaces/useCase/roomVariant/deleteRoomVariantImageUseCase.interface";
import { IGetRoomAvailabilityUseCase } from "@application/interfaces/useCase/roomVariant/getRoomAvailabilityUseCase.interface";

@injectable()
export class RoomVariantController {
  constructor(
    @inject("ICreateRoomVariantUseCase")
    private _createRoomVariantUseCase: ICreateRoomVariantUseCase,
    @inject("IListRoomVariantsByHotelIdUseCase")
    private _listRoomVariantsByHotelIdUseCase: IListRoomVariantsByHotelIdUseCase,
    @inject("IEditRoomVariantUseCase")
    private _editRoomVariantUseCase: IEditRoomVariantUseCase,
    @inject("IGetRoomVariantByIdUseCase")
    private _getRoomVariantByIdUseCase: IGetRoomVariantByIdUseCase,
    @inject("IDeleteRoomVariantImageUseCase")
    private _deleteRoomVariantImageUseCase: IDeleteRoomVariantImageUseCase,
    @inject("IGetRoomAvailabilityUseCase")
    private _getRoomAvailabilityUseCase: IGetRoomAvailabilityUseCase,
  ) {}

  async handleCreateRoomVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : [];

      const data = createRoomVariantValidation.safeParse({
        ...req.body,
        hotelId: req.params.hotelId,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createRoomVariantUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.CREATED,
        Messages.ROOM_VARIANT_CREATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleListRoomVariantsByHotelId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { hotelId } = req.params;

      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result =
        await this._listRoomVariantsByHotelIdUseCase.execute(hotelId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_VARIANT_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleEditRoomVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files?.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files?.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : [];

      const userId = req.user.id;

      const data = editRoomVariantValidation.safeParse({
        ...req.body,
        roomVariantId: req.params.id,
        userId,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._editRoomVariantUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_VARIANT_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetRoomVariantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result = await this._getRoomVariantByIdUseCase.execute(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_VARIANT_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteRoomVariantImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id, index } = req.params;
      const userId = req.user!.id;

      if (!id || index === undefined) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      if (isNaN(Number(index))) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_INDEX);
      }

      await this._deleteRoomVariantImageUseCase.execute(
        id,
        userId,
        Number(index),
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_VARIANT_IMAGE_DELETED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetRoomAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { checkinDate, checkoutDate } = req.query;
      const { roomVariantId } = req.params;

      const data = getRoomAvailabilityValidation.safeParse({
        checkinDate,
        checkoutDate,
        roomVariantId,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      const result = await this._getRoomAvailabilityUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_VARIANT_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}
