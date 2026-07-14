import { useState, useCallback } from "react";
import type { ReportFilterValues } from "@/components/common/reports/ReportFilters";

export function useReportFilters() {
    const [filters, setFilters] = useState<ReportFilterValues>({
        search: "",
        status: "all",
        timeRange: "all",
    });

    const [page, setPage] = useState(1);
    const limit = 10;

    const handleFilterChange = useCallback((newFilters: ReportFilterValues) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page when filters change
    }, []);

    const buildQueryParams = useCallback(() => {
        const params = new URLSearchParams();

        params.append("pageNo", page.toString());
        params.append("limit", limit.toString());

        if (filters.search) {
            params.append("search", filters.search);
        }

        if (filters.status && filters.status !== "all") {
            params.append("status", filters.status);
        }

        if (filters.timeRange && filters.timeRange !== "all") {
            const today = new Date();
            let fromDate: Date | undefined;
            let toDate = new Date();

            switch (filters.timeRange) {
                case "today":
                    fromDate = new Date(today.setHours(0, 0, 0, 0));
                    break;
                case "week":
                    fromDate = new Date(today);
                    fromDate.setDate(fromDate.getDate() - 7);
                    break;
                case "month":
                    fromDate = new Date(today);
                    fromDate.setMonth(fromDate.getMonth() - 1);
                    break;
                case "year":
                    fromDate = new Date(today);
                    fromDate.setFullYear(fromDate.getFullYear() - 1);
                    break;
                case "custom":
                    fromDate = filters.customDateFrom;
                    if (filters.customDateTo) {
                        toDate = new Date(filters.customDateTo);
                        toDate.setHours(23, 59, 59, 999);
                    } else {
                        toDate = new Date();
                    }
                    break;
            }

            if (fromDate) {
                params.append("dateFrom", fromDate.toISOString());
            }
            if (toDate) {
                params.append("dateTo", toDate.toISOString());
            }
        }

        return params;
    }, [filters, page, limit]);

    return {
        filters,
        handleFilterChange,
        page,
        setPage,
        limit,
        buildQueryParams,
    };
}
