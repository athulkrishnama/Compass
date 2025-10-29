import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface AvatarProps {
    profileImage: string;
    image: File | null;
    placeHolder: string;
}
function ProfileAvatar({ image, profileImage, placeHolder }: AvatarProps) {
    return (
        <Avatar className="h-28 w-28 cursor-pointer justify-center items-center bg-stone-100">
            <AvatarImage
                src={image ? URL.createObjectURL(image) : profileImage}
            />
            <AvatarFallback className="text-4xl">{placeHolder}</AvatarFallback>
        </Avatar>
    );
}

export default React.memo(ProfileAvatar);
