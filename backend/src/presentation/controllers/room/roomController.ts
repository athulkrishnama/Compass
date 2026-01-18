import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreateRoomUseCase } from "@application/interfaces/useCase/room/createRoomUseCase.interface";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { createRoomValidationSchema } from "@presentation/validationSchemas/roomValidation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class RoomController {
  constructor(
    @inject("ICreateRoomUseCase")
    private _createRoomUseCase: ICreateRoomUseCase,
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
}
