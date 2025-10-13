import Table from "@/components/shared/Table/Table";
import { Button } from "@/components/ui/button";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import translationKey from "@/utils/i18n/translationKey";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusChangeModal from "./StatusChangeModal";
import { string } from "zod";

interface propTypes {
    data: IGetUsersResponse["clients"];
    handleStatusChange(id: string, status: boolean): void;
}
function UserTable({ data, handleStatusChange }: propTypes) {
    const { t } = useTranslation();
    const [modalState, setModalState] = useState({
        isOpen: false,
        name: "",
        status: false,
        id: "",
    });

    function handleModalClose() {
        setModalState({ ...modalState, isOpen: false });
    }

    function handleOpenConfirmationModal(
        id: string,
        name: string,
        status: boolean
    ) {
        setModalState({ isOpen: true, id, name, status });
    }
    
    function handleConfirm(){
        handleStatusChange(modalState.id, modalState.status);
        setModalState({isOpen:false, id: "", name: "", status:false})
    }

    if (!data.length) return <div>No Data</div>;
    return (
        <>
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
                                    handleOpenConfirmationModal(
                                        row.id,
                                        row.full_name,
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
                data={data}
            />
            <StatusChangeModal
                isOpen={modalState.isOpen}
                handleClose={handleModalClose}
                data={{name: modalState.name, status: modalState.status}}
                handleConfirm={handleConfirm}
            />
        </>
    );
}

export default React.memo(UserTable);
