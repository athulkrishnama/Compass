import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreateDestinationUseCase } from "@application/interfaces/useCase/admin/createDestinationUseCase.interface";
import { IDeleteDestinationImageUseCase } from "@application/interfaces/useCase/admin/deleteDestinationImageUseCase.interface";
import { IFindDestinationByIdUseCase } from "@application/interfaces/useCase/admin/findDestinationByIdUseCase.interface";
import { IListDestinationsUseCase } from "@application/interfaces/useCase/admin/ListDestinationsUseCase.interface";
import { IUpdateDestinationUseCase } from "@application/interfaces/useCase/admin/updateDestinationUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  addDestinationValidationSchema,
  listDestinationsValidationSchema,
  updateDestinationValidationSchema,
} from "@presentation/validationSchemas/adminValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class DestinationController {
  constructor(
    @inject("ICreateDestinationUseCase")
    private _createDestinationUseCase: ICreateDestinationUseCase,
    @inject("IListDestinationsUseCase")
    private _listDestinationUseCase: IListDestinationsUseCase,
    @inject("IUpdateDestinationUseCase")
    private _updateDestinationUseCase: IUpdateDestinationUseCase,
    @inject("IFindDestinationByIdUseCase")
    private _findDestinationByIdUseCase: IFindDestinationByIdUseCase,
    @inject("IDeleteDestinationImageUseCase")
    private _deleteDestinationImageUseCase: IDeleteDestinationImageUseCase,
  ) {}
  async handleCreateDestination(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;
      const images = files.images?.map((img) =>
        mutlterFileToFileconverter(img),
      );

      const coverImage = mutlterFileToFileconverter(files.coverImage![0]);

      const data = addDestinationValidationSchema.safeParse({
        ...req.body,
        images,
        coverImage,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createDestinationUseCase.create(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DESTINATION_ADDED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleListDestinations(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = listDestinationsValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const data = await this._listDestinationUseCase.execute(query.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateDestination(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;
      const images = files?.images?.map((img) =>
        mutlterFileToFileconverter(img),
      );

      const coverImage = files?.coverImage?.[0]
        ? mutlterFileToFileconverter(files.coverImage[0])
        : undefined;

      const data = updateDestinationValidationSchema.safeParse({
        ...req.body,
        id: req.params.id,
        ...(images?.length && { images }),
        ...(coverImage && { coverImage }),
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._updateDestinationUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DESTINATION_UPDATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleFindDestinationById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }

      const data = await this._findDestinationByIdUseCase.execute(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteDestinationImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const { index } = req.params;

      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }

      if (isNaN(+index)) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_INDEX);
      }

      await this._deleteDestinationImageUseCase.execute(id, +index);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DESTINATION_IMAGE_DELETED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
