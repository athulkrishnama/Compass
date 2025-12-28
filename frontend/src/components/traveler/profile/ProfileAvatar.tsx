import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface AvatarProps {
    profileImage: string;
    image: File | null;
    placeHolder: string;
    className?: string;
}
function ProfileAvatar({
    image,
    profileImage,
    placeHolder,
    className = "h-28 w-28",
}: AvatarProps) {
    return (
        <Avatar
            className={`${className} cursor-pointer justify-center items-center bg-stone-100 shadow-lg`}
        >
            <AvatarImage
                src={image ? URL.createObjectURL(image) : profileImage}
            />
            <AvatarFallback className="text-4xl">{placeHolder}</AvatarFallback>
        </Avatar>
    );
}

export default React.memo(ProfileAvatar);
