import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { IEmailService } from "@domain/interfaces/service/emailService.interface";
import { IEmailTemplateGenerator } from "@domain/interfaces/service/emailTemplateGenerator.interface";
import { IHashService } from "@domain/interfaces/service/hashService.interface";
import { IJwtService } from "@domain/interfaces/service/jwtService.interface";
import { IOtpService } from "@domain/interfaces/service/otpService.interface";
import { CacheService } from "@infrastructure/services/cacheService";
import { EmailService } from "@infrastructure/services/emailService";
import { OtpEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/otpEmailTemplate";
import { ResendOtpEmailTemplateGenerator } from "@infrastructure/services/emailTemplateGenerators/resendOtpEmailTemplate";
import { HashService } from "@infrastructure/services/hashService";
import { JwtService } from "@infrastructure/services/jwtService";
import { OtpService } from "@infrastructure/services/otpService";
import { container } from "tsyringe";

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
}
