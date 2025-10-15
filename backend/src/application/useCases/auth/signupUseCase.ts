import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IEmailService } from "application/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "application/interfaces/service/emailTemplateGenerator.interface";
import { IHashService } from "application/interfaces/service/hashService.interface";
import { IOtpService } from "application/interfaces/service/otpService.interface";
import { ISignupUseCase } from "application/interfaces/useCase/auth/signupUseCase.interface";
import { EmailPayloadType } from "@domain/types/emailPayload";
import { EmailSubjects } from "@application/constants/emailConstants";
import { UserMapper } from "application/mappers/user.mapper";
import { AuthError } from "@application/constants/Errors";
import { inject, injectable } from "tsyringe";
import { UserAlreadyExistingException } from "@application/constants/Exceptions";

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
      throw new UserAlreadyExistingException(
        AuthError.AUTH_EXISTING_EMAIL_ERROR,
      );
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
