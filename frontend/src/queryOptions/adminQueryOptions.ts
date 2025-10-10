import { AdminQueryKeys } from "@/constants/queryKeys/adminQueryKeys";
import { changeUserStatus, getUsers } from "@/services/api/adminApiService";
import type { IUserStatusChangeRequest } from "@/types/api/requests/adminRequest";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createGetUsersQueryOption(page: number) {
    return queryOptions<HttpResponse<IGetUsersResponse>>({
        queryKey: [AdminQueryKeys.USERS, page],
        queryFn: () => getUsers(page),
    });
}

export function createChangeUserStatusQueryOptions() {
    return mutationOptions<HttpResponse<{}>, Error, IUserStatusChangeRequest>({
        mutationFn: (data) => changeUserStatus(data),
    });
}
