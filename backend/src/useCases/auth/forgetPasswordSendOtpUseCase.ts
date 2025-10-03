import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { IEmailService } from "@domain/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "@domain/interfaces/service/emailTemplateGenerator.interface";
import { IOtpService } from "@domain/interfaces/service/otpService.interface";
import { IForgetPasswordSendOtpUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { EmailSubjects } from "@useCases/constants/emailConstants";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

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
      throw new Error(AuthError.USER_NOT_FOUND);
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
