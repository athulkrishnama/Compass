import { locationUpdateValidationSchema } from "@presentation/validationSchemas/cabValidation";
import { IUpdateLocationUseCase } from "@application/interfaces/useCase/cab/updateLocationUseCase.interface";
import { inject, injectable } from "tsyringe";
import { InvalideDataException } from "@application/constants/Exceptions";

@injectable()
export class LocationEventHandler {
  constructor(
    @inject("IUpdateLocationUseCase")
    private _updateLocationUseCase: IUpdateLocationUseCase,
  ) {}
  async handleLocationUpdate(payload: object) {
    try {
      const data = locationUpdateValidationSchema.safeParse(payload);
      if (!data.success) {
        throw new InvalideDataException(data.error.issues[0].message);
      }
      await this._updateLocationUseCase.execute(data.data);
    } catch (error) {
      console.log(error);
    }
  }
}
