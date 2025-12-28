import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, X, Save, Camera, Phone, Calendar } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import ImageCropperModal from "./ImageCropperModal";
import { file } from "zod";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { toast } from "sonner";
import ProfileAvatar from "./ProfileAvatar";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createProfileValidationSchema,
    type ProfileFormValues,
} from "@/schemas/profileSchema";

interface UserProfileEditCardProps {
    profileData: {
        full_name: string;
        profile_image?: string;
        mobile?: string;
        date_of_birth?: Date;
    };
    onSave: (updatedData: {
        full_name?: string;
        profile_image: File | null;
        mobile?: string;
        date_of_birth?: Date;
    }) => void;
    onClose: () => void;
}

export function UserProfileEdit({
    profileData,
    onSave,
    onClose,
}: UserProfileEditCardProps) {
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const imageRef = useRef<HTMLInputElement | null>(null);
    const { t } = useTranslation();

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        watch,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(createProfileValidationSchema()),
        defaultValues: {
            full_name: profileData.full_name,
            mobile: profileData.mobile || "",
            date_of_birth: profileData.date_of_birth
                ? new Date(profileData.date_of_birth)
                      .toISOString()
                      .split("T")[0]
                : "",
        },
    });

    const fullName = watch("full_name");

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

    const onSubmit: SubmitHandler<ProfileFormValues> = (
        formData
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const data: {
                full_name?: string | undefined;
                profile_image: File | null;
                mobile?: string;
                date_of_birth?: Date;
            } = { profile_image: null };

            if (profileData.full_name !== formData.full_name)
                data.full_name = formData.full_name;
            if (profileImage) data.profile_image = profileImage;
            if (formData.mobile && profileData.mobile !== formData.mobile)
                data.mobile = formData.mobile;
            if (
                formData.date_of_birth &&
                (!profileData.date_of_birth ||
                    new Date(profileData.date_of_birth)
                        .toISOString()
                        .split("T")[0] !== formData.date_of_birth)
            ) {
                data.date_of_birth = new Date(formData.date_of_birth);
            }

            try {
                onSave(data);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.div className="bg-white rounded-2xl p-0">
                        <div className="flex flex-col items-center justify-center text-center pt-8 relative">
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
                                    placeHolder={fullName?.[0] || "U"}
                                />
                                <motion.div
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                                    accept="image/jpeg,image/png,image/svg+xml,image/webp"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-6 px-8 py-10">
                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Label
                                    htmlFor="full_name"
                                    className="flex items-center text-gray-700 font-medium"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    {t(translationKey.form.fullname)}
                                </Label>
                                <Input
                                    id="full_name"
                                    {...register("full_name")}
                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-400"
                                />
                                <div className="min-h-[1.25rem]">
                                    {errors.full_name && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm"
                                        >
                                            {errors.full_name.message}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Label
                                    htmlFor="mobile"
                                    className="flex items-center text-gray-700 font-medium"
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Mobile
                                </Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    {...register("mobile")}
                                    placeholder="Enter mobile number"
                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-400"
                                />
                                <div className="min-h-[1.25rem]">
                                    {errors.mobile && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm"
                                        >
                                            {errors.mobile.message}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Label
                                    htmlFor="date_of_birth"
                                    className="flex items-center text-gray-700 font-medium"
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Date of Birth
                                </Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    {...register("date_of_birth")}
                                    className="border-gray-300 focus:border-gray-500 focus:ring-gray-400"
                                />
                                <div className="min-h-[1.25rem]">
                                    {errors.date_of_birth && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm"
                                        >
                                            {errors.date_of_birth.message}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="px-8 pb-8 flex justify-between space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                <X className="mr-2 h-4 w-4" />
                                {t(translationKey.button.cancel)}
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting
                                    ? t(translationKey.button.submiting)
                                    : t(translationKey.button.updateProfile)}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
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
