import { IFindDestinationByIdResponseDto } from "@domain/dtos/admin/findDestinationById.dto";

export interface IFindDestinationByIdUseCase {
  execute(id: string): Promise<IFindDestinationByIdResponseDto>;
}
