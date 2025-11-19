"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    HelpCircle,
    UserIcon,
    ImageIcon,
    Edit,
} from "lucide-react";
import type { VERIFICATION_STATUS } from "@/types/verificationStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { VERIFICATION_STATUSES } from "@/constants/verificationStatus";
import { cn } from "@/lib/utils";
import type { ROLE } from "@/types/role";
import { ROLES } from "@/constants/roles";

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
        className: "border-gray-300 text-gray-600", // gray
    },
    PENDING: {
        label: t(translationKey.text.pending),
        hint: t(translationKey.text.verficationBeingReviewed),
        icon: Clock,
        className: "border-yellow-400 text-yellow-700", // muted yellow
    },
    APPROVED: {
        label: t(translationKey.text.verfied),
        hint: t(translationKey.text.profileVerfied),
        icon: CheckCircle2,
        className: "border-green-500 text-green-700", // muted green
    },
    REJECTED: {
        label: t(translationKey.text.rejected),
        hint: t(translationKey.text.verficationRejected),
        icon: XCircle,
        className: "border-red-500 text-red-700", // muted red
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
            className="max-w-md mx-auto border border-gray-200 rounded-lg p-6 bg-white text-black shadow-sm"
        >
            <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 border border-gray-300">
                    <AvatarImage
                        src={profile_image}
                        alt={full_name}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-500">
                        <UserIcon size={24} />
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h2 className="text-xl font-semibold">{full_name}</h2>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                        <Mail size={16} className="mr-1" />
                        {email}
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                        <User size={16} /> {t(translationKey.form.fullname)}
                    </div>
                    <p className="text-black">{full_name}</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                        <Mail size={16} /> {t(translationKey.form.email)}
                    </div>
                    <p className="text-black">{email}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#666]">
                        {t(translationKey.text.verficationStatus)}
                    </div>

                    <Badge
                        variant="outline"
                        className={cn(
                            "font-medium rounded-sm px-2 py-0.5 bg-white border",
                            status.className
                        )}
                    >
                        <status.icon size={16} />
                        {status.label}
                    </Badge>

                    <p className="text-sm text-[#666]">{status.hint}</p>

                    {is_verified === VERIFICATION_STATUSES.REJECTED &&
                        rejection_reason && (
                            <motion.div
                                initial={{ opacity: 0, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-1 border-l border-[#eee] pl-3"
                            >
                                <p className="text-sm font-medium text-black">
                                    {t(translationKey.text.rejectionReason)}
                                </p>
                                <p className="text-sm text-[#666]">
                                    {rejection_reason}
                                </p>
                            </motion.div>
                        )}
                </div>

                <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                        {t(
                            role === ROLES.HOTEL
                                ? translationKey.text.verficationIdImage
                                : translationKey.text.drivingLicence
                        )}
                    </div>

                    {verfication_id_image ? (
                        <div className="relative w-full h-40 border border-gray-200 rounded-md overflow-hidden">
                            <img
                                src={verfication_id_image}
                                alt="Verification ID"
                                className="object-contain bg-gray-50 w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500">
                            <ImageIcon size={32} className="mb-2" />
                            <p className="text-sm">
                                {t(
                                    translationKey.text
                                        .noVerificationImageUploaded
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Button className="mt-6 w-full max-w-md" onClick={setEditing}>
                <Edit className="mr-2 h-4 w-4" />
                {t(translationKey.button.updateProfile)}
            </Button>
        </motion.div>
    );
}

export default ShowProfile;
