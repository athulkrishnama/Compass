import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import ProfileCroppingModal from "./ProfileCroppingModal";
import z from "zod";
import { toast } from "sonner";
import ProfileAvatar from "./ProfileAvatar";
import VerficationIdCroppingModal from "./VerificationIdCroppingModal";
import { Button } from "@/components/ui/button";
import type { VERIFICATION_STATUS } from "@/types/verificationStatus";
import { VERIFICATION_STATUSES } from "@/constants/verificationStatus";
import type { ROLE } from "@/types/role";
import { ROLES } from "@/constants/roles";

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
            className="max-w-md mx-auto border border-gray-200 rounded-lg p-6 bg-white text-black shadow-sm space-y-6"
        >
            <div>
                <h2 className="text-xl font-semibold text-center">
                    {t(translationKey.button.updateProfile)}
                </h2>
            </div>

            <Separator />

            <div className="space-y-2 flex flex-col items-center">
                <Label className="text-gray-700 text-sm font-medium">
                    {t(translationKey.text.profileImage)}
                </Label>
                <ProfileAvatar
                    ProfileUrl={profile_image}
                    profileImage={profileImage}
                    handleClick={cachedHandleImageInputclick}
                />
                <input
                    type="file"
                    hidden
                    ref={profileImageRef}
                    onChange={handleProfileChange}
                />
            </div>

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

            <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">
                    {t(translationKey.form.email)}
                </Label>
                <Input
                    value={email}
                    readOnly
                    className="border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">
                    {t(
                        role === ROLES.HOTEL
                            ? translationKey.text.verficationIdImage
                            : translationKey.text.drivingLicence
                    )}
                </Label>

                {verfication_id_image || verificationIdImage ? (
                    <div className="relative w-full h-40 border border-gray-200 rounded-md overflow-hidden">
                        <img
                            src={
                                verificationIdImage
                                    ? URL.createObjectURL(verificationIdImage)
                                    : verfication_id_image
                            }
                            alt="Verification ID"
                            className="object-contain bg-gray-50 w-full h-full"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        <ImageIcon size={32} className="mb-2" />
                        <p className="text-sm">
                            {t(translationKey.text.noVerificationImageUploaded)}
                        </p>
                    </div>
                )}

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
            </div>
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
            <div className="flex justify-between">
                <Button variant={"outline"} onClick={handleClose}>
                    {t(translationKey.button.close)}
                </Button>
                <Button onClick={handleUpdateProfile}>
                    {t(translationKey.button.updateProfile)}
                </Button>
            </div>
        </motion.div>
    );
}
