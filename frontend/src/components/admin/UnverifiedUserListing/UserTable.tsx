import Table from "@/components/shared/Table/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { IGetUnverifiedUsersResponseDTO } from "@/types/api/responses/getUnverifiedUsersResponse";
import { Eye, UserIcon } from "lucide-react";
import DetailsModal from "./DetailsModal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface UserTableProps {
    users: IGetUnverifiedUsersResponseDTO["users"];
}

function UserTable({ users }: UserTableProps) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | undefined>();
    const { t } = useTranslation();

    function handleDetailsModalClose() {
        setIsDetailsModalOpen(false);
    }

    function handleView(e: React.MouseEvent<HTMLElement>) {
        const element = e.target as HTMLButtonElement;
        const { userid } = element.dataset;

        if (userid) {
            setSelectedUser(userid);
            setIsDetailsModalOpen(true);
        }
    }

    return (
        <div>
            <Table
                headers={[
                    {
                        id: "name",
                        label: t(translationKey.form.fullname),
                        render: (row) => (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={row.profile_image}
                                        alt={row.full_name}
                                    />
                                    <AvatarFallback>
                                        <UserIcon />
                                    </AvatarFallback>
                                </Avatar>
                                <span>{row.full_name}</span>
                            </div>
                        ),
                    },
                    {
                        id: "email",
                        label: t(translationKey.form.email),
                        render: (row) => (
                            <span className="text-muted-foreground">
                                {row.email}
                            </span>
                        ),
                    },
                    {
                        id: "verification_id_image",
                        label: t(translationKey.button.view),
                        render: (row) => (
                            <Button data-userid={row.id} onClick={handleView}>
                                <Eye /> {t(translationKey.button.view)}
                            </Button>
                        ),
                    },
                ]}
                data={users}
            />
            {selectedUser && (
                <DetailsModal
                    isOpen={isDetailsModalOpen}
                    handleClose={handleDetailsModalClose}
                    userId={selectedUser!}
                />
            )}
        </div>
    );
}

export default UserTable;
