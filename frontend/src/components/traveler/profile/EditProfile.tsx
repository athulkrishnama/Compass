import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, X, Save, Camera } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import ImageCropperModal from "./ImageCropperModal";
import { file } from "zod";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { toast } from "sonner";
import ProfileAvatar from "./ProfileAvatar";

interface UserProfileEditCardProps {
    profileData: {
        full_name: string;
        profile_image?: string;
    };
    onSave: (updatedData: {
        full_name?: string;
        profile_image: File | null;
    }) => void;
    onClose: () => void;
}

export function UserProfileEdit({
    profileData,
    onSave,
    onClose,
}: UserProfileEditCardProps) {
    const [fullName, setFullName] = useState(profileData.full_name);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const imageRef = useRef<HTMLInputElement | null>(null);
    const { t } = useTranslation();

    const cardVariants: Variants = {
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
    };

    const handleSave = () => {
        const data: {
            full_name?: string | undefined;
            profile_image: File | null;
        } = { profile_image: null };
        if (profileData.full_name != fullName) data.full_name = fullName;
        if (profileImage) data.profile_image = profileImage;
        onSave(data);
    };

    function handleImageEdit(e: ChangeEvent<HTMLInputElement>) {
        const schema = file()
            .max(1024 * 1024 * 2, {
                error: t(translationKey.errors.maxFileSize, { size: "2MB" }),
            })
            .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"], {
                error: t(translationKey.text.selectImage),
            });
        if (e.target.files?.[0]) {
            const parsedImage = schema.safeParse(e.target.files[0]);

            if (parsedImage.error) {
                toast.error(parsedImage.error.issues[0].message);
                return;
            }
            setProfileImage(e.target.files?.[0] || null);
            setIsCropping(true);
        }
    }

    function handleCropComplete(image?: File) {
        setProfileImage(image || null);
        setIsCropping(false);
    }
    return (
        <>
            <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-lg"
            >
                <Card>
                    <CardHeader className="items-center justify-center text-center pt-8 relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2,
                            }}
                            className="relative group"
                        >
                            <ProfileAvatar
                                image={profileImage}
                                profileImage={profileData.profile_image!}
                                placeHolder={fullName[0]}
                            />
                            <motion.div
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ opacity: 1 }}
                                onClick={() => imageRef.current?.click()}
                            >
                                <Camera className="h-8 w-8 text-white" />
                            </motion.div>
                            <input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={handleImageEdit}
                            />
                        </motion.div>
                    </CardHeader>

                    <CardContent className="space-y-8 px-8 py-10">
                        <div className="space-y-2">
                            <Label
                                htmlFor="full_name"
                                className="flex items-center"
                            >
                                <User className="mr-2 h-4 w-4" />
                                {t(translationKey.form.fullname)}
                            </Label>
                            <Input
                                id="full_name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="px-8 pb-8 flex justify-end space-x-4">
                        <Button variant="outline" size="lg" onClick={onClose}>
                            <X className="mr-2 h-4 w-4" />
                            {t(translationKey.button.cancel)}
                        </Button>
                        <Button size="lg" onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            {t(translationKey.button.updateProfile)}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
            <ImageCropperModal
                isOpen={isCropping}
                handleClose={handleCropComplete}
                image={profileImage!}
            />
        </>
    );
}

export default UserProfileEdit;
