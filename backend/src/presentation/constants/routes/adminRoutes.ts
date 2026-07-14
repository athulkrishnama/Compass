export enum AdminRoutes {
  USERS = "/users",
  STATUS = "/status",
  VERIFICATION = "/users/verification",
  REJECT_USER = "/users/verification/:id/reject",
  APPROVE_USER = "/users/verification/:id/approve",
  TRANSACTIONS = "/transactions",
  HOTEL_REPORT = "/reports/hotel",
  HOTEL_REPORT_PDF = "/reports/hotel/pdf",
  CAB_REPORT = "/reports/cab",
  CAB_REPORT_PDF = "/reports/cab/pdf",
  DASHBOARD_STATS = "/dashboard-stats",
}
