import { EmailPayloadType } from "@domain/types/emailPayload";

export interface IEmailService {
  sendMail(payload: EmailPayloadType): Promise<void>;
}
