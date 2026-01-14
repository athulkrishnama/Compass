export enum AdminRoutes {
    USERS = "/admin/users",
    STATUS = "/admin/status",
    UNVERIFIED_USERS = "/admin/users/verification",
    REJECT_USER = "/admin/users/verification/##id##/reject",
    APPROVE_USER = "/admin/users/verification/##id##/approve",
    DESTINATIONS = "/admin/destinations",
    DESTINATION_IMAGE = "/admin/destinations/##id##/images/##index##",
}
