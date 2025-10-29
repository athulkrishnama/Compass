/* eslint-disable @tanstack/query/exhaustive-deps */
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import type { filterType } from "@/pages/admin/Users";
import { changeUserStatus, getUsers } from "@/services/api/adminApiService";
import type { IUserStatusChangeRequest } from "@/types/api/requests/adminRequest";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import type { HttpResponse } from "@/types/api/responseType";
import {
    keepPreviousData,
    mutationOptions,
    queryOptions,
} from "@tanstack/react-query";

export function createGetUsersQueryOption(filter: filterType) {
    return queryOptions<HttpResponse<IGetUsersResponse>>({
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
