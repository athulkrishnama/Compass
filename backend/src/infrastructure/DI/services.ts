import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IEmailService } from "application/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "application/interfaces/service/emailTemplateGenerator.interface";
import { IHashService } from "application/interfaces/service/hashService.interface";
import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { IOtpService } from "application/interfaces/service/otpService.interface";
import { ITokenService } from "application/interfaces/service/tokenService.interface";
import { CacheService } from "@infrastructure/services/cacheService";
import { EmailService } from "@infrastructure/services/emailService";
import { ForgetPasswordOtpEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/forgetPasswordEmailTemplate";
import { OtpEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/otpEmailTemplate";
import { ResendOtpEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/resendOtpEmailTemplate";
import { HashService } from "@infrastructure/services/hashService";
import { JwtService } from "@infrastructure/services/jwtService";
import { OtpService } from "@infrastructure/services/otpService";
import { TokenService } from "@infrastructure/services/tokenService";
import { container } from "tsyringe";
import { IGoogleAuthService } from "@application/interfaces/service/googleAuthService.interface";
import { GoogleAuthService } from "@infrastructure/services/googleAuthService";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { StorageService } from "@infrastructure/services/storageService";
import { ChangeEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/changeEmailTemplateGenerator";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";
import { PaymentService } from "@infrastructure/services/paymentService";
import { IHotelPricingService } from "@application/interfaces/service/hotelPricingService";
import { PricingService } from "@infrastructure/services/hotelPricingService";
export function registerServices() {
  container.registerSingleton<IHashService>("IHashService", HashService);
  container.registerSingleton<IOtpService>("IOtpService", OtpService);
  container.registerSingleton<IEmailService>("IEmailService", EmailService);
  container.registerSingleton<ICacheService>("ICacheService", CacheService);
  container.registerSingleton<IJwtService>("IJwtService", JwtService);
  container.registerSingleton<IEmailTemplateGenerator>(
    "IOtpMailService",
    OtpEmailTemplateGenerator,
  );
  container.registerSingleton<IEmailTemplateGenerator>(
    "IResendOtpMailTemplateGenerator",
    ResendOtpEmailTemplateGenerator,
  );
  container.registerSingleton<IEmailTemplateGenerator>(
    "ForgetPasswordOtpEmailTemplateGenerator",
    ForgetPasswordOtpEmailTemplateGenerator,
  );
  container.registerSingleton<IEmailTemplateGenerator>(
    "ChangeEmailTemplateGenerator",
    ChangeEmailTemplateGenerator,
  );
  container.registerSingleton<ITokenService>("ITokenService", TokenService);
  container.registerSingleton<IGoogleAuthService>(
    "IGoogleAuthService",
    GoogleAuthService,
  );
  container.registerSingleton<IStorageService>(
    "IStorageService",
    StorageService,
  );
  container.registerSingleton<IPaymentService>(
    "IPaymentService",
    PaymentService,
  );
  container.registerSingleton<IHotelPricingService>(
    "IHotelPricingService",
    PricingService,
  );

}
