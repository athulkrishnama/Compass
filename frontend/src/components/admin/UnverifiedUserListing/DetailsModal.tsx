import Modal from "@/components/shared/modal/Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    User,
    Ellipsis,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { VERIFICATION_STATUS } from "@/types/verificationStatus";
import type React from "react";
import translationKey from "@/utils/i18n/translationKey";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createApproveUserVerificationRequestMutationOption,
    createGetUnverifiedUserDetailsQueryOptions,
    createRejectUserVerificationRequestMutationOption,
} from "@/queryOptions/adminQueryOptions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RejectionForm from "./RejectionForm";
import { toast } from "sonner";
import { VERIFICATION_STATUSES } from "@/constants/verificationStatus";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";

interface DetailsModalProps {
    isOpen: boolean;
    handleClose: () => void;
    userId: string;
}
const verificationValues: Record<
    VERIFICATION_STATUS,
    { text: string; icon: React.ReactElement; class: string }
> = {
    PENDING: {
        class: "bg-yellow-400 text-white hover:bg-yellow-500",
        text: translationKey.text.pending,
        icon: <AlertTriangle />,
    },
    APPROVED: {
        class: "bg-green-600 text-white hover:bg-green-700",
        text: translationKey.text.verfied,
        icon: <CheckCircle />,
    },
    REJECTED: {
        class: "bg-red-600 text-white hover:bg-red-700",
        icon: <XCircle />,
        text: translationKey.text.rejected,
    },
    NOT_SUBMITTED: {
        class: "bg-secondary-400 text-white hover:bg-secondary-500",
        text: translationKey.text.notSubmited,
        icon: <Ellipsis />,
    },
};

function DetailsModal({ handleClose, isOpen, userId }: DetailsModalProps) {
    const [isRejecting, setIsRejecting] = useState(false);
    const { t } = useTranslation();
    const { data: user } = useQuery(
        createGetUnverifiedUserDetailsQueryOptions(userId!)
    );

    const { mutate: approveMutation } = useMutation(
        createApproveUserVerificationRequestMutationOption(userId)
    );

    const { mutate: rejectMutation } = useMutation(
        createRejectUserVerificationRequestMutationOption(userId)
    );

    function handleModalClose() {
        handleClose();
        setIsRejecting(false);
    }

    function handleReject(reason: string) {
        rejectMutation(
            { reason },
            {
                onSuccess(response) {
                    toast.success(response.message);
                    invalidateData(userId);
                },
                onError(err) {
                    toast.error(err.message);
                },
                onSettled() {
                    handleModalClose();
                },
            }
        );
    }

    function handleApprove() {
        approveMutation(undefined, {
            onSuccess(response) {
                toast.success(response.message);
                invalidateData(userId);
            },
            onError(err) {
                toast.error(err.message);
            },
            onSettled() {
                handleModalClose();
            },
        });
    }

    function invalidateData(id: string) {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.UNVERIFIED_USERS, id],
        });
    }

    return (
        <Modal handleClose={handleModalClose} isOpen={isOpen}>
            {user?.data && (
                <div className="w-full max-w-lg  text-black ">
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <Avatar className="h-20 w-20 border-2 border-neutral-300">
                                    <AvatarImage
                                        src={user.data.profile_image}
                                        alt={user.data.full_name}
                                    />
                                    <AvatarFallback className="text-2xl bg-neutral-100 text-neutral-600">
                                        <User />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            <motion.div
                                className="space-y-1"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-3xl font-bold text-black">
                                    {user.data.full_name}
                                </h2>
                                <p className="text-neutral-500">
                                    {user.data.email}
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="space-y-6 p-6 pt-0">
                        <div>
                            <Label className="text-sm font-medium text-neutral-600">
                                {t(translationKey.text.status)}
                            </Label>
                            <motion.div
                                className="mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Badge
                                    variant="default"
                                    className={`shadow-sm transition-colors ${verificationValues[user.data.is_verified!].class}`}
                                >
                                    {
                                        verificationValues[
                                            user.data.is_verified!
                                        ].icon
                                    }
                                    {t(
                                        verificationValues[
                                            user.data.is_verified!
                                        ].text
                                    )}
                                </Badge>
                            </motion.div>
                        </div>
                        <div>
                            <Label
                                htmlFor="verification-image"
                                className="text-sm font-medium text-neutral-600"
                            >
                                {t(translationKey.text.verficationIdImage)}
                            </Label>
                            <motion.div
                                id="verification-image"
                                className="mt-2 overflow-hidden      p-2 flex justify-center items-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <img
                                    src={user.data.verification_id_image}
                                    alt="Verification ID"
                                    className="object-contain min-w-[150px] max-w-full min-h-[100px] max-h-[250px]"
                                />
                            </motion.div>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {isRejecting ? (
                            <RejectionForm
                                handleReject={handleReject}
                                handleCancel={() => setIsRejecting(false)}
                            />
                        ) : (
                            <motion.div
                                className="flex justify-between"
                                key="second"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Button
                                    disabled={
                                        user.data.is_verified !==
                                        VERIFICATION_STATUSES.PENDING
                                    }
                                    variant={"error"}
                                    onClick={() => setIsRejecting(true)}
                                >
                                    {t(translationKey.button.reject)}
                                </Button>
                                <Button
                                    onClick={handleApprove}
                                    disabled={
                                        user.data.is_verified !==
                                        VERIFICATION_STATUSES.PENDING
                                    }
                                >
                                    {t(translationKey.button.approve)}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </Modal>
    );
}

export default DetailsModal;
