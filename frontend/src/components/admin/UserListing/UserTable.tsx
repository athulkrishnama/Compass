import Table from "@/components/shared/Table/Table";
import { Button } from "@/components/ui/button";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import translationKey from "@/utils/i18n/translationKey";
import React from "react";
import { useTranslation } from "react-i18next";

interface propTypes {
    data: IGetUsersResponse["clients"];
    handleStatusChange(id: string, status: boolean): void;
}
function UserTable({ data, handleStatusChange }: propTypes) {
    const { t } = useTranslation();

    if (!data.length) return <div>No Data</div>;
    return (
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
                        <span className="text-gray-700">{row.email}</span>
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
                                handleStatusChange(row.id, !row.is_blocked)
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
            data={data}
        />
    );
}

export default React.memo(UserTable);
