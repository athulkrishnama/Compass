import { ROLES } from "@domain/types/roles";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: ROLES;
      };
    }
  }
}
