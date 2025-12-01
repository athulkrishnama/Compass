"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    CheckCircle2,
    XCircle,
    Clock,
    HelpCircle,
    UserIcon,
    ImageIcon,
    Edit,
} from "lucide-react";
import type { VERIFICATION_STATUS } from "@/types/verificationStatus";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { VERIFICATION_STATUSES } from "@/constants/verificationStatus";
import { cn } from "@/lib/utils";
import type { ROLE } from "@/types/role";
import { ROLES } from "@/constants/roles";
import ChangePasswordModalWithButton from "../changePassword/ChangePasswordModalWithButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShowProfileProps {
    profileData: {
        full_name: string;
        email: string;
        profile_image?: string;
        verfication_id_image?: string;
        is_verified: VERIFICATION_STATUS;
        rejection_reason?: string;
    };
    setEditing: () => void;
    role: ROLE;
}

const statusConfig: Record<
    VERIFICATION_STATUS,
    { label: string; hint: string; icon: React.ElementType; className: string }
> = {
    NOT_SUBMITTED: {
        label: t(translationKey.text.notSubmited),
        hint: t(translationKey.text.submitDetails),
        icon: HelpCircle,
        className: "border-gray-300 text-gray-600",
    },
    PENDING: {
        label: t(translationKey.text.pending),
        hint: t(translationKey.text.verficationBeingReviewed),
        icon: Clock,
        className: "border-yellow-400 text-yellow-700",
    },
    APPROVED: {
        label: t(translationKey.text.verfied),
        hint: t(translationKey.text.profileVerfied),
        icon: CheckCircle2,
        className: "border-green-500 text-green-700",
    },
    REJECTED: {
        label: t(translationKey.text.rejected),
        hint: t(translationKey.text.verficationRejected),
        icon: XCircle,
        className: "border-red-500 text-red-700",
    },
};

function ShowProfile({ profileData, setEditing, role }: ShowProfileProps) {
    const {
        full_name,
        email,
        profile_image,
        verfication_id_image,
        is_verified,
        rejection_reason,
    } = profileData;
    const status = statusConfig[is_verified];

    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="  rounded-lg bg-white text-black  w-full h-full p-2"
        >
            <div className="p-2">
                <div className="flex  gap-6 ">
                    <motion.div
                        className="flex w-1/3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.1,
                        }}
                    >
                        <div className="h-full w-full">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Avatar className="rounded-md shadow-[0_12px_32px_0_rgba(0,0,0,0.45)] flex-shrink-0 bg-white w-full h-full">
                                    <AvatarImage
                                        src={profile_image}
                                        alt={full_name}
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                    <AvatarFallback className="bg-gray-100 text-gray-500 flex items-center justify-center w-full h-full rounded-md">
                                        <UserIcon
                                            size={40}
                                            className="text-gray-400 w-full h-full"
                                        />
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex-1 space-y-4 w-2/3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            delay: 0.2,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.3,
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                {full_name}
                            </h2>
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.4,
                            }}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Mail size={16} />{" "}
                                {t(translationKey.form.email)}
                            </div>
                            <p className="text-black">{email}</p>
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.5,
                            }}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-[#666]">
                                {t(translationKey.text.verficationStatus)}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.6,
                                }}
                            >
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "font-medium rounded-sm px-2 py-0.5 bg-white border",
                                        status.className
                                    )}
                                >
                                    <status.icon size={16} className="mr-1" />
                                    {status.label}
                                </Badge>
                            </motion.div>

                            <motion.p
                                className="text-sm text-[#666]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.7,
                                }}
                            >
                                {status.hint}
                            </motion.p>

                            {is_verified === VERIFICATION_STATUSES.REJECTED &&
                                rejection_reason && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.8,
                                        }}
                                        className="space-y-1 border-l border-[#eee] pl-3"
                                    >
                                        <p className="text-sm font-medium text-black">
                                            {t(
                                                translationKey.text
                                                    .rejectionReason
                                            )}
                                        </p>
                                        <p className="text-sm text-[#666]">
                                            {rejection_reason}
                                        </p>
                                    </motion.div>
                                )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Separator />
            <motion.div
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.6,
                }}
            >
                <motion.div
                    className="text-sm font-medium text-gray-600 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.3,
                        delay: 0.7,
                    }}
                >
                    {t(
                        role === ROLES.HOTEL
                            ? translationKey.text.verficationIdImage
                            : translationKey.text.drivingLicence
                    )}
                </motion.div>

                {verfication_id_image ? (
                    <motion.div
                        className="relative w-full h-40 rounded-md overflow-hidden"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.8,
                        }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <img
                            src={verfication_id_image}
                            alt="Verification ID"
                            className="object-contain bg-gray-50 w-full h-full"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center w-full h-40 rounded-md bg-gray-50 text-gray-500"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.8,
                        }}
                    >
                        <ImageIcon size={32} className="mb-2" />
                        <p className="text-sm">
                            {t(translationKey.text.noVerificationImageUploaded)}
                        </p>
                    </motion.div>
                )}
            </motion.div>

            <Separator />
            <motion.div
                className="p-6 flex justify-evenly gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.7,
                }}
            >
                <div className="w-1/2 transition-transform duration-200 hover:scale-105 active:scale-95">
                    <Button className="w-full" onClick={setEditing}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t(translationKey.button.updateProfile)}
                    </Button>
                </div>
                <ChangePasswordModalWithButton className="w-1/2 transition-transform duration-200 hover:scale-105 active:scale-95" />
            </motion.div>
        </motion.div>
    );
}

export default ShowProfile;
