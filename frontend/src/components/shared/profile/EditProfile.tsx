import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Upload, Image as ImageIcon, Mail, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import ProfileCroppingModal from "./ProfileCroppingModal";
import z from "zod";
import { toast } from "sonner";
import VerficationIdCroppingModal from "./VerificationIdCroppingModal";
import { Button } from "@/components/ui/button";
import type { VERIFICATION_STATUS } from "@/types/verificationStatus";
import { VERIFICATION_STATUSES } from "@/constants/verificationStatus";
import type { ROLE } from "@/types/role";
import { ROLES } from "@/constants/roles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileProps {
    profileData: {
        full_name: string;
        email: string;
        profile_image?: string;
        verfication_id_image?: string;
        is_verified: VERIFICATION_STATUS;
    };
    onChange: (data: {
        full_name?: string;
        profile_image?: File;
        verification_id_image?: File;
    }) => void;
    handleClose: () => void;
    role: ROLE;
}

export default function EditProfile({
    profileData,
    onChange,
    handleClose,
    role,
}: EditProfileProps) {
    const { t } = useTranslation();
    const {
        full_name,
        email,
        profile_image,
        verfication_id_image,
        is_verified,
    } = profileData;
    const [name, setName] = useState(full_name);
    const profileImageRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] =
        useState(false);

    const [verificationIdImage, setVerificationIdImage] = useState<File | null>(
        null
    );
    const [isVerificationModalOpen, setIsVerificationModalOpen] =
        useState(false);

    function handleProfileChange(e: ChangeEvent<HTMLInputElement>) {
        const fileSchema = z
            .file()
            .max(5 * 1024 * 1024, {
                error: t(translationKey.errors.maxFileSize, { size: "5MB" }),
            })
            .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"], {
                error: t(translationKey.text.selectImage),
            });

        if (e.target.files?.[0]) {
            const image = fileSchema.safeParse(e.target.files[0]);

            if (image.error) {
                toast.error(image.error.issues[0].message);
                return;
            }
            setProfileImage(e.target.files[0]);
            setIsProfileImageModalOpen(true);
        }
    }

    function handleVerficationIdChange(e: ChangeEvent<HTMLInputElement>) {
        const fileSchema = z
            .file()
            .max(5 * 1024 * 1024, {
                error: t(translationKey.errors.maxFileSize, { size: "5MB" }),
            })
            .mime(["image/jpeg", "image/png", "image/svg+xml", "image/webp"], {
                error: t(translationKey.text.selectImage),
            });

        if (e.target.files?.[0]) {
            const image = fileSchema.safeParse(e.target.files[0]);

            if (image.error) {
                toast.error(image.error.issues[0].message);
                return;
            }
            setVerificationIdImage(e.target.files[0]);
            setIsVerificationModalOpen(true);
        }
    }

    function handleProfileImageCropComplete(image?: File) {
        if (image) setProfileImage(image);
        else setProfileImage(null);
        setIsProfileImageModalOpen(false);
    }

    function handleVerficationIdImageCropComplete(image?: File) {
        if (image) setVerificationIdImage(image);
        else setVerificationIdImage(null);
        setIsVerificationModalOpen(false);
    }

    function handleUpdateProfile() {
        const data: {
            full_name?: string;
            profile_image?: File;
            verification_id_image?: File;
        } = {};
        if (name != full_name) {
            data.full_name = name;
        }

        if (profileImage) data.profile_image = profileImage;
        if (verificationIdImage)
            data.verification_id_image = verificationIdImage;

        onChange(data);
        handleClose();
    }

    function handleImageInputClick() {
        profileImageRef.current?.click();
    }

    const cachedHandleImageInputclick = useCallback(handleImageInputClick, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg bg-white text-black w-full h-full px-6 py-2"
        >
            <div className="">
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
                        <div className="h-full w-full">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="relative group cursor-pointer h-full w-full"
                                onClick={cachedHandleImageInputclick}
                            >
                                <Avatar className="rounded-md shadow-[0_12px_32px_0_rgba(0,0,0,0.45)] flex-shrink-0 bg-white w-full h-full">
                                    <AvatarImage
                                        src={
                                            profileImage
                                                ? URL.createObjectURL(
                                                      profileImage
                                                  )
                                                : profile_image
                                        }
                                        alt={full_name}
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                    <AvatarFallback className="bg-gray-100 text-gray-500 flex items-center justify-center w-full h-full rounded-md">
                                        <UserIcon
                                            size={40}
                                            className="text-gray-400"
                                        />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={24} className="text-white" />
                                </div>
                            </motion.div>
                        </div>
                        <input
                            type="file"
                            hidden
                            ref={profileImageRef}
                            onChange={handleProfileChange}
                        />
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
                            <div className="space-y-2">
                                <Label
                                    htmlFor="full_name"
                                    className="text-gray-700 text-sm font-medium"
                                >
                                    {t(translationKey.form.fullname)}
                                </Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    className="border-gray-300 text-black"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
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
                            <Input
                                value={email}
                                readOnly
                                className="border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <Separator className="my-4" />
            <motion.div
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

                {verfication_id_image || verificationIdImage ? (
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
                            src={
                                verificationIdImage
                                    ? URL.createObjectURL(verificationIdImage)
                                    : verfication_id_image
                            }
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

                <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: 0.9,
                    }}
                >
                    <label
                        htmlFor="verfication_id_image"
                        className={`flex items-center justify-center gap-2 cursor-pointer border border-gray-300 text-gray-700 rounded-md px-3 py-2 text-sm transition w-fit
    ${
        ![
            VERIFICATION_STATUSES.NOT_SUBMITTED,
            VERIFICATION_STATUSES.REJECTED,
        ].includes(is_verified)
            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
            : "hover:bg-gray-50"
    }`}
                    >
                        <Upload size={16} />
                        {t(
                            role === ROLES.HOTEL
                                ? translationKey.text.uploadVerficationId
                                : translationKey.text.uploadDrivingLicence
                        )}
                    </label>
                    <Input
                        disabled={
                            ![
                                VERIFICATION_STATUSES.NOT_SUBMITTED,
                                VERIFICATION_STATUSES.REJECTED,
                            ].includes(is_verified)
                        }
                        id="verfication_id_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleVerficationIdChange}
                    />
                </motion.div>
            </motion.div>
            <ProfileCroppingModal
                handleClose={handleProfileImageCropComplete}
                isOpen={isProfileImageModalOpen}
                image={profileImage!}
            />
            <VerficationIdCroppingModal
                handleClose={handleVerficationIdImageCropComplete}
                image={verificationIdImage!}
                isOpen={isVerificationModalOpen}
            />
            <Separator className="my-4" />
            <motion.div
                className=" flex justify-evenly gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.7,
                }}
            >
                <motion.div
                    className="w-1/2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleClose}
                    >
                        {t(translationKey.button.close)}
                    </Button>
                </motion.div>
                <motion.div
                    className="w-1/2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <Button className="w-full" onClick={handleUpdateProfile}>
                        {t(translationKey.button.updateProfile)}
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
