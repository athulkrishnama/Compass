import Filter from "@/components/admin/UserListing/Filter";
import UserTable from "@/components/admin/UserListing/UserTable";
import Pagination from "@/components/shared/Pagination/Pagination";
import { queryClient } from "@/config/tanstackQueryConfig";
import { AdminQueryKeys } from "@/constants/queryKeys/adminQueryKeys";
import {
    createChangeUserStatusQueryOptions,
    createGetUsersQueryOption,
} from "@/queryOptions/adminQueryOptions";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import type { HttpResponse } from "@/types/api/responseType";
import type { ROLE } from "@/types/role";
import translationKey from "@/utils/i18n/translationKey";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface filterType {
    query: string;
    role: ROLE | "all";
    status: "active" | "blocked" | "all";
    pageNo: number;
}
function Users() {
    const [filter, setFilter] = useState<filterType>({
        query: "",
        role: "all",
        status: "all",
        pageNo: 1,
    });
    const { data } = useQuery(createGetUsersQueryOption(filter));
    const { t } = useTranslation();
    const { mutate } = useMutation(createChangeUserStatusQueryOptions());

    const setPage = (no: number) =>
        setFilter((prev) => ({ ...prev, pageNo: no }));

    function handleStatusChange(id: string, status: boolean) {
        mutate(
            { id, status },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    queryClient.setQueryData(
                        [AdminQueryKeys.USERS, filter.pageNo],
                        (response: HttpResponse<IGetUsersResponse>) => {
                            const newUsers = response.data?.clients.map(
                                (user) => {
                                    if (user.id === id) {
                                        return { ...user, is_blocked: status };
                                    }
                                    return user;
                                }
                            );

                            const newData = structuredClone(response);
                            if (newData.data)
                                newData.data.clients = newUsers || [];
                            return newData;
                        }
                    );
                },
                onError: (err) => {
                    console.log(err);
                    toast.error(err.message);
                },
            }
        );
    }
    {
        return (
            <div className="p-8 bg-white rounded-2xl shadow-sm h-full flex flex-col pb-40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t(translationKey.headings.userManagement)}
                    </h1>
                </div>

                <div className="flex flex-col flex-grow">
                    <div className="mb-3">
                        <Filter filter={filter} setFilter={setFilter} />
                    </div>

                    <div className="flex-grow min-h-[400px]">
                        {data?.data?.clients?.length ? (
                            <div className="h-full overflow-auto">
                                <UserTable
                                    handleStatusChange={handleStatusChange}
                                    data={data.data.clients}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                No users found
                            </div>
                        )}
                    </div>

                    {data?.data?.clients?.length ? (
                        <div className="flex justify-center mt-3 mb-1">
                            <Pagination
                                totalPages={data.data.totalPages}
                                currentPage={filter.pageNo}
                                setPage={setPage}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Users;
