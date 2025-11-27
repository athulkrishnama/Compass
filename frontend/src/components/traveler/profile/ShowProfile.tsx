import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Edit, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
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
            variants={{
                initial: { opacity: 0, y: 50 },
                animate: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeInOut" },
                },
                exit: {
                    opacity: 0,
                    y: -50,
                    transition: { duration: 0.3, ease: "easeOut" },
                },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-lg"
        >
            <Card>
                <CardHeader className="items-center justify-center text-center pt-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2,
                        }}
                    >
                        <Avatar className="h-28 w-28">
                            {" "}
                            <AvatarImage src={profile_image} alt={full_name} />
                            <AvatarFallback className="text-4xl">
                                {" "}
                                {full_name[0]}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>
                </CardHeader>

                <CardContent className="space-y-8 px-8 py-10">
                    <div className="space-y-2">
                        <Label
                            htmlFor="full_name"
                            className="flex items-center text-sm font-medium text-muted-foreground"
                        >
                            <User className="mr-2 h-4 w-4" />
                            {t(translationKey.form.fullname)}
                        </Label>
                        <p id="full_name" className="text-2xl font-semibold">
                            {full_name}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="flex items-center text-sm font-medium text-muted-foreground"
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            {t(translationKey.form.email)}
                        </Label>
                        <p id="email" className="text-lg text-gray-800">
                            {" "}
                            {email}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="px-8 pb-8 flex flex-col gap-3">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={switchEditState}
                    >
                        {" "}
                        <Edit className="mr-2 h-4 w-4" />{" "}
                        {t(translationKey.button.updateProfile)}
                    </Button>
                    <ChangePasswordModalWithButton className="w-full" />
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default ShowProfile;
