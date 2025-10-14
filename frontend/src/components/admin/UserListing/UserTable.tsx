import Table from "@/components/shared/Table/Table";
import { Button } from "@/components/ui/button";
import type { IGetUsersResponse } from "@/types/api/responses/adminResponse";
import translationKey from "@/utils/i18n/translationKey";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusChangeModal from "./StatusChangeModal";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

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

    function handleConfirm() {
        handleStatusChange(modalState.id, modalState.status);
        setModalState({ isOpen: false, id: "", name: "", status: false });
    }

    if (!data.length) return <div>No Data</div>;
    return (
        <>
            <div className="w-full">
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
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                    }}
                                >
                                    <Button
                                        onClick={() =>
                                            handleOpenConfirmationModal(
                                                row.id,
                                                row.full_name,
                                                !row.is_blocked
                                            )
                                        }
                                        className={`group flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 w-24
      ${
          row.is_blocked
              ? ""
              : "bg-rose-600 text-white hover:bg-rose-700"
      }`}
                                    >
                                        {row.is_blocked ? (
                                            <Unlock className="w-4 h-4" />
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}

                                        {t(
                                            row.is_blocked
                                                ? translationKey.button.unBlock
                                                : translationKey.button.block
                                        )}
                                    </Button>
                                </motion.div>
                            ),
                        },
                    ]}
                    data={data}
                />
            </div>
            <StatusChangeModal
                isOpen={modalState.isOpen}
                handleClose={handleModalClose}
                data={{ name: modalState.name, status: modalState.status }}
                handleConfirm={handleConfirm}
            />
        </>
    );
}

export default React.memo(UserTable);
