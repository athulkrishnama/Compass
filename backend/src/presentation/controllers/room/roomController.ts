import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreateRoomUseCase } from "@application/interfaces/useCase/room/createRoomUseCase.interface";
import { IEditRoomUseCase } from "@application/interfaces/useCase/room/editRoomUseCase.interface";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  createRoomValidationSchema,
  editRoomValidationSchema,
} from "@presentation/validationSchemas/roomValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class RoomController {
  constructor(
    @inject("ICreateRoomUseCase")
    private _createRoomUseCase: ICreateRoomUseCase,
    @inject("IEditRoomUseCase")
    private _editRoomUseCase: IEditRoomUseCase,
  ) {}

  handleCreateRoom = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = createRoomValidationSchema.safeParse(req.body);

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
  };

  handleEditRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;
      const data = editRoomValidationSchema.safeParse({
        ...req.body,
        id,
        userId,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._editRoomUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.CREATED,
        Messages.ROOM_UPDATED,
      );
    } catch (error) {
      next(error);
    }
  };
}
