import { injectable } from "tsyringe";
import { BaseEmailTemplateGenerator } from "./baseEmailTemplateGenerators";

@injectable()
export class ResendOtpEmailTemplateGenerator extends BaseEmailTemplateGenerator {
  generateHtml(data: Record<string, string>): string {
    const otpDesign = `<div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #dee2e6; text-align: center; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">

    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #212529;">
        Your New Verification Code
    </h1>
    
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #6c757d;">
        You requested a new verification code. Please use the code below to complete your sign-in.  
        (Note: Any previous code is now invalid.)
    </p>
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #343a40; letter-spacing: 8px; line-height: 1.2;">
            ${data.otp}
        </p>
    </div>
    
    <p style="margin: 0; font-size: 14px; color: #6c757d;">
        This code is valid for the next 10 minutes. If you did not request this code, you can safely ignore this email.
    </p>

</div>`;
    return this.wrapper(otpDesign);
  }
}
