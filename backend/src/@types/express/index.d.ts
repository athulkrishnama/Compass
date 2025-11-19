import { ROLES } from "@domain/types/roles";
import { i18n, TFunction } from "i18next";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: ROLES;
      };
      lng: string;
      locale: string;
      t: TFunction;
      i18n: i18n;
    }
  }
}
