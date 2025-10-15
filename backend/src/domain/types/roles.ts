import { ROLES as ROLE_VALUES } from "../constants/roles";
export type ROLES =
  | ROLE_VALUES.ADMIN
  | ROLE_VALUES.CAB
  | ROLE_VALUES.HOTEL
  | ROLE_VALUES.TRAVELER;
