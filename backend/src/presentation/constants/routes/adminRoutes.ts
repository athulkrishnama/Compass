export enum AdminRoutes {
  USERS = "/users",
  STATUS = "/status",
  VERIFICATION = "/users/verification",
  REJECT_USER = "/users/verification/:id/reject",
  APPROVE_USER = "/users/verification/:id/approve",
  TRANSACTIONS = "/transactions",
}
