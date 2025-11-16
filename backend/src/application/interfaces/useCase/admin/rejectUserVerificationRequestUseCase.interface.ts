import { IRejectUserVerificationRequestRequestDTO } from "@domain/dtos/admin/rejectUserVerificationRequest.dto";

export interface IRejectUserVerificationRequestUseCase {
  reject(dto: IRejectUserVerificationRequestRequestDTO): Promise<void>;
}
