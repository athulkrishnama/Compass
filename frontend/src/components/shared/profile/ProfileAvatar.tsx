import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import React from "react";

interface ProfileAvatarProps {
    imageUrl?: string | null;
    fallbackText?: string;
    className?: string;
}

function ProfileAvatar({
    imageUrl,
    fallbackText,
    className,
}: ProfileAvatarProps) {
    return (
        <div className="w-full h-full">
            <Avatar
                className={cn(
                    "rounded-md shadow-[0_12px_32px_0_rgba(0,0,0,0.45)] bg-white w-full h-full flex-shrink-0",
                    className
                )}
            >
                <AvatarImage
                    src={imageUrl ?? undefined}
                    alt={fallbackText}
                    className="object-cover w-full h-full rounded-md"
                />
                <AvatarFallback className="bg-gray-100 text-gray-500 flex items-center justify-center w-full h-full rounded-md text-3xl">
                    {fallbackText?.charAt(0)?.toUpperCase() ?? (
                        <UserIcon size={40} className="text-gray-400" />
                    )}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}

export default React.memo(ProfileAvatar);
