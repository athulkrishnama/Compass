import { IEmailTemplateGenerator } from "@domain/interfaces/service/emailTemplateGenerator.interface";

export abstract class BaseEmailTemplateGenerator
  implements IEmailTemplateGenerator
{
  protected getHeader(): string {
    return `<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #dee2e6; display: flex; align-items: center; justify-content: space-between;'>
        
        <div>
            <img src='https://via.placeholder.com/150x45.png?text=Your+Logo' alt='Company Logo' style='display: block; max-height: 45px; width: auto; border: 0;'>
        </div>
        
        <div style='font-size: 24px; font-weight: bold; color: #212529;'>
            Compass
        </div>

    </div>`;
  }

  protected getFooter(): string {
    return `<div style='max-width: 600px; margin: 30px auto 0 auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border: 1px solid #dee2e6; text-align: center; font-size: 12px; color: #6c757d;'>
        
        <p style='margin: 0 0 10px 0;'>
            © 2025 Compass. All Rights Reserved.
        </p>
        
        <p style='margin: 0 0 10px 0;'>
           Brototype, maradu
        </p>
        
        <p style='margin: 0;'>
            Don't want to receive these emails? 
            <a href='#' target='_blank' style='color: #495057; text-decoration: none; font-weight: bold;'>Unsubscribe</a>.
        </p>

    </div>`;
  }

  protected wrapper(body: string): string {
    return `<!DOCTYPE html>
                <html>
                <head>
                <title>Compass Mail</title>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                </head>
                <body style='margin: 0 !important; padding: 20px !important; background-color: #f4f4f4; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;'>
                    ${this.getHeader()}
                    ${body}
                    ${this.getFooter()}
                    </body>
                </html>`;
  }
  abstract generateHtml(data: Record<string, string>): string;
}
