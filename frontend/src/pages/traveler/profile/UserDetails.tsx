import EditProfile from "@/components/traveler/profile/EditProfile";
import ShowProfile from "@/components/traveler/profile/ShowProfile";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    createGetUserProfileQueryOptions,
    createUpdateUserProfileQueryOptions,
} from "@/queryOptions/authQueryOptions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

function UserDetails() {
    const [isEditing, setIsEditing] = useState(false);
    const { mutate } = useMutation(createUpdateUserProfileQueryOptions());
    const {
        data: profileDataResponse,
        isLoading,
        isError,
    } = useQuery(createGetUserProfileQueryOptions());
    const profileData = profileDataResponse?.data;

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
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.USER_PROFILE],
                });
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    }

    if (isLoading || isError) {
        return null;
    }

    if (isEditing) {
        return (
            <EditProfile
                profileData={{
                    full_name: profileData?.full_name ?? "",
                    profile_image: profileData?.profile_image ?? "",
                }}
                onClose={() => setIsEditing(false)}
                onSave={handleUpdate}
            />
        );
    }

    return (
        <ShowProfile
            profileData={profileData!}
            switchEditState={() => setIsEditing(true)}
        />
    );
}

export default UserDetails;
