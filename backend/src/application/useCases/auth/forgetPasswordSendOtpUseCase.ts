import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IEmailService } from "application/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "application/interfaces/service/emailTemplateGenerator.interface";
import { IOtpService } from "application/interfaces/service/otpService.interface";
import { IForgetPasswordSendOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { EmailSubjects } from "@application/constants/emailConstants";
import { inject, injectable } from "tsyringe";
import { UserNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class ForgetPasswordSendOtpUseCase
  implements IForgetPasswordSendOtpUseCase
{
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IOtpService") private _otpService: IOtpService,
    @inject("ForgetPasswordOtpEmailTemplateGenerator")
    private _emailTemplateGenerator: IEmailTemplateGenerator,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}

  async sendOtp(email: string): Promise<void> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const otp = this._otpService.generateOtp(6);
    const content = this._emailTemplateGenerator.generateHtml({ otp });

    const emailPayload: EmailPayloadType = {
      receiverMailid: email,
      subject: EmailSubjects.FORGET_PASSWORD_OTP,
      content,
    };

    await this._emailService.sendMail(emailPayload);

    await this._cacheService.setWithExpiry(`FOTP:${email}`, otp, 5 * 60);
  }
}
