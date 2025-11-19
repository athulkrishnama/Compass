import EditProfile from "@/components/shared/profile/EditProfile";
import ShowProfile from "@/components/shared/profile/ShowProfile";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { ROLES } from "@/constants/roles";
import {
    createGetUserProfileQueryOptions,
    createUpdateUserProfileQueryOptions,
} from "@/queryOptions/authQueryOptions";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    const {
        data: { data: userData },
    } = useSuspenseQuery(createGetUserProfileQueryOptions());

    const { mutate } = useMutation(createUpdateUserProfileQueryOptions());

    function setEditing() {
        setIsEditing(true);
    }

    function setShowProfile() {
        setIsEditing(false);
    }

    const profileVariants: Variants = {
        enter: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 25 },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.15 },
        },
        initial: {
            opacity: 0,
            y: 20,
        },
    };

    function handleDataChange(data: {
        full_name?: string;
        profile_image?: File;
        verification_id_image?: File;
    }): void {
        const form = new FormData();

        if (data.full_name) form.append("full_name", data.full_name);
        if (data.profile_image)
            form.append("profile_image", data.profile_image);
        if (data.verification_id_image)
            form.append("verification_id_image", data.verification_id_image);

        mutate(form, {
            onSuccess: (response) => {
                console.log(response);
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER_PROFILE],
                });
                toast.success(response.message);
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    }
    return (
        <div className="flex w-full h-full flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="edit"
                            variants={profileVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                        >
                            <EditProfile
                                profileData={userData!}
                                onChange={handleDataChange}
                                handleClose={setShowProfile}
                                role={ROLES.CAB}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="show"
                            variants={profileVariants}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                        >
                            <ShowProfile
                                profileData={userData!}
                                setEditing={setEditing}
                                role={ROLES.CAB}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Profile;
