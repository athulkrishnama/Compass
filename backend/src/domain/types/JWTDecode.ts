import { ROLES } from "./roles";

export interface JWTDecodeType {
  id: string;
  role: ROLES;
  jti: string;
}
