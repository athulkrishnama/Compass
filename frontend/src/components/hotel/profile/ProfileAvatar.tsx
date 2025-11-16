import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Camera, UserIcon } from "lucide-react";

interface ProfileAvatarProps {
    profileImage: File | null;
    ProfileUrl?: string;
    handleClick: () => void;
}

function ProfileAvatar({
    profileImage,
    ProfileUrl,
    handleClick,
}: ProfileAvatarProps) {
    return (
        <div className="flex justify-center items-center">
            <div className="relative group cursor-pointer w-28 h-28 rounded-full overflow-hidden">
                <Avatar.Root className="w-full h-full rounded-full overflow-hidden  border-gray-300">
                    <Avatar.Image
                        src={
                            profileImage
                                ? URL.createObjectURL(profileImage)
                                : ProfileUrl
                        }
                        alt="Profile Image"
                        className="w-full h-full object-cover"
                    />
                    <Avatar.Fallback className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                        <UserIcon size={40} />
                    </Avatar.Fallback>
                </Avatar.Root>

                <div
                    onClick={handleClick}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Camera size={24} className="text-white" />
                </div>
            </div>
        </div>
    );
}

export default React.memo(ProfileAvatar);
