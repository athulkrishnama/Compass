import { ROLES } from "./roles";

export interface JWTPayloadType {
  id: string;
  role: ROLES;
}
