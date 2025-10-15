import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IEmailService } from "application/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "application/interfaces/service/emailTemplateGenerator.interface";
import { ISignupResendOtpUsecase } from "application/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { EmailSubjects } from "@application/constants/emailConstants";
import { AuthError } from "@application/constants/Errors";
import { inject, injectable } from "tsyringe";
import {
  InvalidOTPException,
  UserDataMissingException,
} from "@application/constants/Exceptions";

@injectable()
export class SignupResendOtpUseCase implements ISignupResendOtpUsecase {
  constructor(
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IResendOtpMailTemplateGenerator")
    private _emailTemplateGenerator: IEmailTemplateGenerator,
  ) {}
  async resend(email: string): Promise<void> {
    const otp = await this._cacheService.getValue(`OTP:${email}`);

    if (!otp) {
      throw new InvalidOTPException(AuthError.OTP_EXPIRED_OR_NOT_REQUESTED);
    }

    const userData = await this._cacheService.getValue(`SIGNUPDATA:${email}`);
    if (!userData) {
      throw new UserDataMissingException(AuthError.USER_DATA_MISSIING_IN_CACHE);
    }

    const emailContent = this._emailTemplateGenerator.generateHtml({ otp });

    const payload: EmailPayloadType = {
      receiverMailid: email,
      subject: EmailSubjects.REGISTRATION_RESEND_OTP,
      content: emailContent,
    };

    await this._emailService.sendMail(payload);

    await this._cacheService.setWithExpiry(`OTP:${email}`, otp, 60 * 5);
    await this._cacheService.setWithExpiry(
      `SIGNUPDATA:${email}`,
      userData,
      60 * 5,
    );
  }
}
