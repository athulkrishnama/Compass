import EditProfile from "@/components/traveler/profile/EditProfile";
import ShowProfile from "@/components/traveler/profile/ShowProfile";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    createGetUserProfileQueryOptions,
    createUpdateUserProfileQueryOptions,
} from "@/queryOptions/authQueryOptions";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const {
        data: { data: userData },
    } = useSuspenseQuery(createGetUserProfileQueryOptions());

    const { mutate } = useMutation(createUpdateUserProfileQueryOptions());

    function switchToEdit() {
        setIsEditing(true);
    }

    function switchToShowProfile() {
        setIsEditing(false);
    }

    function handleUpdate({
        full_name,
        profile_image,
    }: {
        full_name?: string;
        profile_image: File | null;
    }): void {
        if (!full_name && !profile_image) return;

        const form = new FormData();
        if (full_name) form.append("full_name", full_name);
        if (profile_image) form.append("profile_image", profile_image);

        mutate(form, {
            onSuccess: (res) => {
                setIsEditing(false);
                toast.success(res.message);
                console.log(res);
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER_PROFILE],
                });
            },
            onError: (err) => {
                console.log(err);
            },
        });
    }

    return (
        <div className="h-full flex items-center justify-center bg-white text-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <EditProfile
                            profileData={{
                                full_name: userData?.full_name ?? "",
                                profile_image: userData?.profile_image ?? "",
                            }}
                            onClose={switchToShowProfile}
                            onSave={handleUpdate}
                        />
                    ) : (
                        <ShowProfile
                            profileData={userData!}
                            switchEditState={switchToEdit}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default Profile;
