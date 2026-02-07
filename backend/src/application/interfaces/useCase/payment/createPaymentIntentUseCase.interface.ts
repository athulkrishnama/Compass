import {
  ICreateIndentRequestDTO,
  ICreateIndentResponseDTO,
} from "@domain/dtos/payment/createIndent.dto";

export interface ICreatePaymentIntentUseCase {
  execute(data: ICreateIndentRequestDTO): Promise<ICreateIndentResponseDTO>;
}
