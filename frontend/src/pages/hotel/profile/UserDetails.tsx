import ShowProfile from "@/components/shared/profile/ShowProfile";
import { useState } from "react";
import EditProfile from "@/components/shared/profile/EditProfile";
import { ROLES } from "@/constants/roles";
import {
    createGetUserProfileQueryOptions,
    createUpdateUserProfileQueryOptions,
} from "@/queryOptions/authQueryOptions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
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

    if (isEditing && !isLoading && !isError) {
        return (
            <EditProfile
                profileData={profileData!}
                onChange={handleDataChange}
                handleClose={() => setIsEditing(false)}
                role={ROLES.HOTEL}
            />
        );
    }

    if (!isEditing && !isLoading && !isError)
        return (
            <ShowProfile
                profileData={profileData!}
                setEditing={() => setIsEditing(true)}
                role={ROLES.HOTEL}
            />
        );
}

export default UserDetails;
