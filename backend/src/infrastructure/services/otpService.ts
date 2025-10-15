import { IOtpService } from "application/interfaces/service/otpService.interface";
import { injectable } from "tsyringe";

@injectable()
export class OtpService implements IOtpService {
  generateOtp(digits: number): string {
    return (
      Math.pow(10, digits - 1) +
      Math.floor(Math.random() * 9 * Math.pow(10, digits - 1)) +
      ""
    );
  }
}
