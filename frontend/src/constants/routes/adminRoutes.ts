export enum AdminRoutes {
    USERS = "/admin/users",
    STATUS = "/admin/status",
    UNVERIFIED_USERS = "/admin/users/verification",
    REJECT_USER = "/admin/users/verification/##id##/reject",
    APPROVE_USER = "/admin/users/verification/##id##/approve",
    TRANSACTIONS = "/admin/transactions",
    DASHBOARD_STATS = "/admin/dashboard-stats",
    HOTEL_REPORT = "/admin/reports/hotel",
    HOTEL_REPORT_PDF = "/admin/reports/hotel/pdf",
    CAB_REPORT = "/admin/reports/cab",
    CAB_REPORT_PDF = "/admin/reports/cab/pdf",
}
