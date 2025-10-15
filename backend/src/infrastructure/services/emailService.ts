import { IEmailService } from "application/interfaces/service/emailService.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { env } from "@config/envConfig";
import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
export class EmailService implements IEmailService {
  private _transporter: nodemailer.Transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }
  async sendMail(payload: EmailPayloadType): Promise<void> {
    await this._transporter.sendMail({
      to: payload.receiverMailid,
      subject: payload.subject,
      html: payload.content,
    });
  }
}
