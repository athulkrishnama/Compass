import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IChangeEmailRequestOtpUseCase } from "@application/interfaces/useCase/auth/changeEmailRequestOtpUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";
import { IEmailTemplateGenerator } from "@application/interfaces/service/emailTemplateGenerator.interface";
import { IOtpService } from "@application/interfaces/service/otpService.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { IEmailService } from "@application/interfaces/service/emailService.interface";
import { env } from "@config/envConfig";

@injectable()
export class ChangeEmailRequestOtpUseCase
  implements IChangeEmailRequestOtpUseCase
{
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepo,
    @inject("IEmailTemplateGenerator")
    private _emailTemplateGenerator: IEmailTemplateGenerator,
    @inject("IOtpService") private _otpService: IOtpService,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IEmailService") private _emailService: IEmailService,
  ) {}
  async execute(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const otp = this._otpService.generateOtp(6);
    const emailTemplate = this._emailTemplateGenerator.generateHtml({
      otp,
    });

    this._emailService.sendMail({
      receiverMailid: user.email,
      subject: "Change Email Request",
      content: emailTemplate,
    });

    this._cacheService.setWithExpiry(
      `CHANGE_EMAIL_OTP_${userId}`,
      otp,
      env.OTP_EXPIRATION_TIME,
    );
  }
}
