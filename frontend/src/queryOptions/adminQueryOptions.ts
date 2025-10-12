import { AdminQueryKeys } from "@/constants/queryKeys/adminQueryKeys";
import type { filterType } from "@/pages/admin/Users";
import { changeUserStatus, getUsers } from "@/services/api/adminApiService";
import type { IUserStatusChangeRequest } from "@/types/api/requests/adminRequest";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { keepPreviousData, mutationOptions, queryOptions } from "@tanstack/react-query";

export function createGetUsersQueryOption( filter: filterType) {
    return queryOptions<HttpResponse<IGetUsersResponse>>({
        queryKey: [AdminQueryKeys.USERS, filter.pageNo],
        queryFn: () => getUsers( filter),
        placeholderData: keepPreviousData
    });
}

export function createChangeUserStatusQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, IUserStatusChangeRequest>({
        mutationFn: (data) => changeUserStatus(data),
    });
}
