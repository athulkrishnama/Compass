import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  createRoomValidation,
  editRoomValidation,
} from "@presentation/validationSchemas/roomValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ICreateRoomUseCase } from "@application/interfaces/useCase/room/createRoomUseCase.interface";
import { IListRoomsByHotelIdUseCase } from "@application/interfaces/useCase/room/listRoomsByHotelIdUseCase.interface";
import { IEditRoomUseCase } from "@application/interfaces/useCase/room/editRoomUseCase.interface";
import { IGetRoomByIdUseCase } from "@application/interfaces/useCase/room/getRoomByIdUseCase.interface";
import { IDeleteRoomImageUseCase } from "@application/interfaces/useCase/room/deleteRoomImageUseCase.interface";

@injectable()
export class RoomController {
  constructor(
    @inject("ICreateRoomUseCase")
    private _createRoomUseCase: ICreateRoomUseCase,
    @inject("IListRoomsByHotelIdUseCase")
    private _listRoomsByHotelIdUseCase: IListRoomsByHotelIdUseCase,
    @inject("IEditRoomUseCase")
    private _editRoomUseCase: IEditRoomUseCase,
    @inject("IGetRoomByIdUseCase")
    private _getRoomByIdUseCase: IGetRoomByIdUseCase,
    @inject("IDeleteRoomImageUseCase")
    private _deleteRoomImageUseCase: IDeleteRoomImageUseCase,
  ) {}

  async handleCreateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : [];

      const data = createRoomValidation.safeParse({
        ...req.body,
        hotelId: req.params.hotelId,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createRoomUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.CREATED,
        Messages.ROOM_CREATED,
      );
    } catch (error) {
      next(error);
    }
  }
  async handleListRoomsByHotelId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { hotelId } = req.params;

      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result = await this._listRoomsByHotelIdUseCase.execute(hotelId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleEditRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;

      const coverImage = files?.coverImage
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const images = files?.images
        ? files.images.map((image) => mutlterFileToFileconverter(image))
        : [];

      const data = editRoomValidation.safeParse({
        ...req.body,
        roomId: req.params.id,
        coverImage,
        images,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._editRoomUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result = await this._getRoomByIdUseCase.execute(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteRoomImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, index } = req.params;
      const userId = req.user!.id;

      if (!id || index === undefined) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      if (isNaN(Number(index))) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_INDEX);
      }

      await this._deleteRoomImageUseCase.execute(id, userId, Number(index));

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ROOM_IMAGE_DELETED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
