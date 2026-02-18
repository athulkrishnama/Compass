import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    getOverallDashboard,
    getHotelDashboard,
} from "@/services/api/hotel.ApiService";
import type { HttpResponse } from "@/types/api/responseType";
import type {
    IOverallDashboardResponse,
    IHotelDashboardResponse,
} from "@/types/api/responses/dashboardResponse";

export function createOverallDashboardQueryOptions() {
    return queryOptions<HttpResponse<IOverallDashboardResponse>>({
        queryKey: [QUERY_KEYS.OVERALL_DASHBOARD],
        queryFn: getOverallDashboard,
    });
}

export function createHotelDashboardQueryOptions(hotelId: string) {
    return queryOptions<HttpResponse<IHotelDashboardResponse>>({
        queryKey: [QUERY_KEYS.HOTEL_DASHBOARD, hotelId],
        queryFn: () => getHotelDashboard(hotelId),
    });
}
