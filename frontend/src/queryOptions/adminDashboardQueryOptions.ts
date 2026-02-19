import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api/adminApiService";
import type { DashboardFilter } from "@/types/admin/dashboard.types";

export function createGetAdminDashboardStatsQueryOption(
    filter: DashboardFilter
) {
    return queryOptions({
        queryKey: ["adminDashboard", filter],
        queryFn: () => getDashboardStats(filter),
        placeholderData: keepPreviousData,
    });
}
