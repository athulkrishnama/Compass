import { injectable } from "tsyringe";
import { BaseEmailTemplateGenerator } from "./baseEmailTemplateGenerators";

@injectable()
export class ChangeEmailTemplateGenerator extends BaseEmailTemplateGenerator {
  generateHtml(data: Record<string, string>): string {
    const otpDesign = `<div style='max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #dee2e6; text-align: center; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;'>

      <h1 style='margin: 0 0 16px 0; font-size: 24px; font-weight: bold; color: #212529;'>
          Change Your Email Address
      </h1>
      
      <p style='margin: 0 0 24px 0; font-size: 16px; color: #6c757d;'>
          We received a request to change the email address associated with your account. Use the code below to verify your identity.
      </p>
      
      <div style='background-color: #f8f9fa; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;'>
          <p style='margin: 0; font-size: 36px; font-weight: bold; color: #343a40; letter-spacing: 8px; line-height: 1.2;'>
              ${data.otp}
          </p>
      </div>
      
      <p style='margin: 0 0 16px 0; font-size: 14px; color: #6c757d;'>
          This code is valid for the next 2 minutes.
       </p>

      <p style='margin: 0; font-size: 14px; color: #6c757d;'>
          If you did not request an email change, please secure your account immediately.
      </p>

</div>`;
    return this.wrapper(otpDesign);
  }
}
