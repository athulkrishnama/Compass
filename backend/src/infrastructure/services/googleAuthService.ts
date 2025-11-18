import { InvalideDataException } from "@application/constants/Exceptions";
import { IGoogleAuthService } from "@application/interfaces/service/googleAuthService.interface";
import { env } from "@config/envConfig";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { OAuth2Client } from "google-auth-library";
import { injectable } from "tsyringe";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private _oAuth2Client: OAuth2Client;
  constructor() {
    this._oAuth2Client = new OAuth2Client({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: "postmessage",
    });
  }
  async authorize(code: string): Promise<{
    email: string;
    googleId: string;
    profileImage: string;
    full_name: string;
  }> {
    const token = await this._oAuth2Client.getToken(code);

    if (!token.tokens.id_token) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING,
      );
    }
    const ticket = await this._oAuth2Client.verifyIdToken({
      idToken: token.tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!(payload?.email && payload.sub && payload.picture && payload.name)) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING,
      );
    }
    return {
      email: payload?.email,
      googleId: payload?.sub,
      profileImage: payload?.picture,
      full_name: payload.name,
    };
  }
}
