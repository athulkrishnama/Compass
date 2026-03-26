import { ICalculateFareUseCase } from "@application/interfaces/useCase/fare/calculateFareUseCase.interface";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { Messages } from "@domain/enums/messages";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { calculateFareValidationSchema } from "@presentation/validationSchemas/fareValidation";
import { InvalideDataException } from "@application/constants/Exceptions";

@injectable()
export class FareController {
  constructor(
    @inject("ICalculateFareUseCase")
    private _calculateFareUseCase: ICalculateFareUseCase,
  ) {}

  async handleCalculateFare(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsedData = calculateFareValidationSchema.safeParse(req.body);

      if (!parsedData.success) {
        throw new InvalideDataException(parsedData.error.issues[0].message);
      }

      const result = await this._calculateFareUseCase.execute({
        ...parsedData.data,
        travelerId: req.user.id,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}
