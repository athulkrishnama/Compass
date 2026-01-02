import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import ChangePasswordModalWithButton from "@/components/shared/changePassword/ChangePasswordModalWithButton";
import ProfileAvatar from "./ProfileAvatar";
import ChangeEmailButtonWithModal from "@/components/shared/changeEmail/ChangeEmailButtonWithModal";

interface PropType {
    profileData: {
        full_name: string;
        email: string;
        profile_image?: string;
        mobile?: string;
        date_of_birth?: Date;
        is_google_login: boolean;
    };
    switchEditState: () => void;
}

function ShowProfile({
    profileData: {
        email,
        full_name,
        profile_image,
        mobile,
        date_of_birth,
        is_google_login,
    },
    switchEditState,
}: PropType) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg bg-white text-black w-full h-full p-8"
        >
            <div className="flex flex-col items-center mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.1,
                    }}
                    className="mb-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProfileAvatar
                            image={null}
                            profileImage={profile_image || ""}
                            placeHolder={full_name[0]}
                            className="h-32 w-32"
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.3,
                    }}
                >
                    <h2 className="text-3xl font-bold text-center">
                        {full_name}
                    </h2>
                </motion.div>
            </div>

            <div className="space-y-4 mb-8">
                {/* Email */}
                <motion.div
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.4,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Mail size={20} className="text-gray-700" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {t(translationKey.form.email)}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {email}
                            </p>
                        </div>
                        {!is_google_login && <ChangeEmailButtonWithModal />}
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.5,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Phone size={20} className="text-gray-700" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {t(translationKey.form.mobile)}
                            </p>
                            <p
                                className={
                                    mobile
                                        ? "text-sm font-medium text-gray-900"
                                        : "text-sm font-medium text-gray-400 italic"
                                }
                            >
                                {mobile || t(translationKey.text.notProvided)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.6,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Calendar size={20} className="text-gray-700" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {t(translationKey.form.dateOfBirth)}
                            </p>
                            <p
                                className={
                                    date_of_birth
                                        ? "text-sm font-medium text-gray-900"
                                        : "text-sm font-medium text-gray-400 italic"
                                }
                            >
                                {date_of_birth
                                    ? new Date(
                                          date_of_birth
                                      ).toLocaleDateString()
                                    : t(translationKey.text.notProvided)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.7,
                }}
            >
                <div className="flex-1 transition-transform duration-200 hover:scale-105 active:scale-95">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={switchEditState}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        {t(translationKey.button.updateProfile)}
                    </Button>
                </div>
                {!is_google_login && (
                    <ChangePasswordModalWithButton className="flex-1 transition-transform duration-200 hover:scale-105 active:scale-95" />
                )}
            </motion.div>
        </motion.div>
    );
}

export default ShowProfile;
