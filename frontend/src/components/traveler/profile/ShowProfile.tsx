import { Button } from "@/components/ui/button";
import { Edit, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import ChangePasswordModalWithButton from "@/components/shared/changePassword/ChangePasswordModalWithButton";

interface PropType {
    profileData: {
        full_name: string;
        email: string;
        profile_image?: string;
    };
    switchEditState: () => void;
}

function ShowProfile({
    profileData: { email, full_name, profile_image },
    switchEditState,
}: PropType) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg bg-white text-black w-full h-full p-2"
        >
            <div className="p-2">
                <div className="flex gap-6">
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
                        <div className="h-full w-full flex justify-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Avatar className="h-28 w-28">
                                    <AvatarImage
                                        src={profile_image}
                                        alt={full_name}
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {full_name[0]}
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
                            <h2 className="text-2xl font-bold mb-2">
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
                                <Mail size={16} />
                                {t(translationKey.form.email)}
                            </div>
                            <p className="text-black">{email}</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Separator />

            <motion.div
                className="p-6 flex justify-evenly gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.3,
                }}
            >
                <div className="w-1/2 transition-transform duration-200 hover:scale-105 active:scale-95">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={switchEditState}
                    >
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
