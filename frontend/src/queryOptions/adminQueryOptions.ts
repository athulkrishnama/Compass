/* eslint-disable @tanstack/query/exhaustive-deps */
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type { filterType } from "@/pages/admin/Users";
import {
    approveUserVerificationRequest,
    changeUserStatus,
    getUnverifiedUserDetails,
    getUnverifiedUsers,
    getUsers,
    rejectUserVerificationRequest,
    getAdminHotelReport,
    getAdminCabReport,
} from "@/services/api/adminApiService";
import type {
    IRejectUserRegistrationRequest,
    IUserStatusChangeRequest,
} from "@/types/api/requests/adminRequest";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import type { IGetUnverifiedUserDetailsResponseDTO } from "@/types/api/responses/getUnverifiedUserDetailsResponse";
import type { IGetUnverifiedUsersResponseDTO } from "@/types/api/responses/getUnverifiedUsersResponse";
import type { HttpResponse } from "@/types/api/responseType";
import type { ROLE } from "@/types/role";
import {
    keepPreviousData,
    mutationOptions,
    queryOptions,
} from "@tanstack/react-query";

export function createGetUsersQueryOption(filter: filterType) {
    return queryOptions<HttpResponse<IGetUsersResponse>, Error>({
        queryKey: [QUERY_KEYS.USERS, filter.pageNo],
        queryFn: () => getUsers(filter),
        placeholderData: keepPreviousData,
    });
}

export function createChangeUserStatusQueryOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        IUserStatusChangeRequest
    >({
        mutationFn: (data) => changeUserStatus(data),
    });
}

export function createGetUnverifiedUsersQueryOptions(
    pageNo: number,
    role: ROLE,
    query: string
) {
    return queryOptions<HttpResponse<IGetUnverifiedUsersResponseDTO>, Error>({
        queryKey: [QUERY_KEYS.UNVERIFIED_USERS, pageNo, role, query],
        queryFn: () => getUnverifiedUsers({ pageNo, role, query }),
        placeholderData: keepPreviousData,
    });
}

export function createGetUnverifiedUserDetailsQueryOptions(id: string) {
    return queryOptions<
        HttpResponse<IGetUnverifiedUserDetailsResponseDTO>,
        Error
    >({
        queryKey: [QUERY_KEYS.UNVERIFIED_USERS, id],
        queryFn: () => getUnverifiedUserDetails(id),
    });
}

export function createRejectUserVerificationRequestMutationOption(id: string) {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        IRejectUserRegistrationRequest
    >({
        mutationFn: (data) => rejectUserVerificationRequest(id, data),
    });
}

export function createApproveUserVerificationRequestMutationOption(id: string) {
    return mutationOptions<HttpResponse<object>, Error>({
        mutationFn: () => approveUserVerificationRequest(id),
    });
}

export function createGetAdminHotelReportQueryOptions(
    params: Parameters<typeof getAdminHotelReport>[0]
) {
    return queryOptions({
        queryKey: [QUERY_KEYS.ADMIN_HOTEL_REPORT, params],
        queryFn: () => getAdminHotelReport(params),
    });
}

export function createGetAdminCabReportQueryOptions(
    params: Parameters<typeof getAdminCabReport>[0]
) {
    return queryOptions({
        queryKey: [QUERY_KEYS.ADMIN_CAB_REPORT, params],
        queryFn: () => getAdminCabReport(params),
    });
}
