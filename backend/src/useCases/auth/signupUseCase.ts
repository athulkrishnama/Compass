import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";
import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { IEmailService } from "@domain/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "@domain/interfaces/service/emailTemplateGenerator.interface";
import { IHashService } from "@domain/interfaces/service/hashService.interface";
import { IOtpService } from "@domain/interfaces/service/otpService.interface";
import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { EmailSubjects } from "@infrastructure/constants/emailConstants";
import { UserMapper } from "@mappers/user.mapper";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class SignupUseCase implements ISignupUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IOtpService") private _otpService: IOtpService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IOtpMailService")
    private _emailTemplateGenerator: IEmailTemplateGenerator,
    @inject("IHashService") private _hashService: IHashService,
  ) {}

  async signup(userData: ICreateUserRequestDTO): Promise<void> {
    const existingUser = await this._userRepo.findByEmail(userData.email);

    if (existingUser) {
      throw new Error(AuthError.AUTH_EXISTING_EMAIL_ERROR);
    }

    const OTP = this._otpService.generateOtp(6);

    const htmlContent = this._emailTemplateGenerator.generateHtml({ otp: OTP });

    const emailPayload: EmailPayloadType = {
      receiverMailid: userData.email,
      subject: EmailSubjects.REGISTRATION_SEND_OTP,
      content: htmlContent,
    };

    await this._emailService.sendMail(emailPayload);

    userData.password = await this._hashService.hash(userData.password);

    this._cacheService.setWithExpiry(
      `SIGNUPDATA:${userData.email}`,
      UserMapper.toStringfromCreateUserDTO(userData),
      60 * 5,
    );
    this._cacheService.setWithExpiry(`OTP:${userData.email}`, OTP, 60 * 5);
  }
}
