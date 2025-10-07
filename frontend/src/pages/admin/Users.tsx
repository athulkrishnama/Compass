import Pagination from "@/components/shared/Pagination/Pagination";
import Table from "@/components/shared/Table/Table";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/config/tanstackQueryConfig";
import { AdminQueryKeys } from "@/constants/queryKeys/adminQueryKeys";
import {
    createChangeUserStatusQueryOptions,
    createGetUsersQueryOption,
} from "@/queryOptions/adminQueryOptions";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import translationKey from "@/utils/i18n/translationKey";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function Users() {
    const [page, setPage] = useState(1);
    const { data } = useQuery(createGetUsersQueryOption(page));
    const { t } = useTranslation();

    const { mutate } = useMutation(createChangeUserStatusQueryOptions());

    function handleStatusChange(id: string, status: boolean) {
        mutate(
            { id, status },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    queryClient.setQueryData(
                        [AdminQueryKeys.USERS, page],
                        (response: { data: IGetUsersResponse }) => {
                            const newUsers = response.data.clients.map(
                                (user) => {
                                    if (user.id === id)
                                        return { ...user, is_blocked: status };
                                    return user;
                                }
                            );

                            const newRes = structuredClone(response);
                            newRes.data.clients = newUsers;
                            return newRes;
                        }
                    );
                },
                onError: (err) => console.log(err),
            }
        );
    }

    if (data?.data?.clients.length) {
        return (
            <div className="p-8 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t(translationKey.headings.userManagement)}
                    </h1>
                </div>

                <div className="w-full overflow-x-auto rounded-xl ">
                    <Table
                        headers={[
                            {
                                id: "name",
                                label: "Name",
                                render: (row) => (
                                    <span className="font-medium text-gray-800">
                                        {row.full_name}
                                    </span>
                                ),
                            },
                            {
                                id: "email",
                                label: "Email",
                                render: (row) => (
                                    <span className="text-gray-700">
                                        {row.email}
                                    </span>
                                ),
                            },
                            {
                                id: "role",
                                label: "Role",
                                render: (row) => (
                                    <span className="capitalize text-gray-700">
                                        {row.role}
                                    </span>
                                ),
                            },
                            {
                                id: "status",
                                label: "Status",
                                render: (row) => (
                                    <Button
                                        onClick={() =>
                                            handleStatusChange(
                                                row.id,
                                                !row.is_blocked
                                            )
                                        }
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                            row.is_blocked
                                                ? ""
                                                : "bg-red-600 hover:bg-red-700 text-white"
                                        }`}
                                    >
                                        {t(
                                            row.is_blocked
                                                ? translationKey.button.unBlock
                                                : translationKey.button.block
                                        )}
                                    </Button>
                                ),
                            },
                        ]}
                        data={data.data.clients}
                    />
                </div>

                {data.data && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            totalPages={data.data.totalPages}
                            currentPage={page}
                            setPage={setPage}
                        />
                    </div>
                )}
            </div>
        );
    } else {
        return <h1>NO data</h1>;
    }
}

export default Users;
