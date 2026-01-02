import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    createChangeEmailNewEmailMutationOptions,
    createChangeEmailRequestOtpMutationOptions,
    createChangeEmailVerifyOtpMutationOptions,
    createGetUserProfileQueryOptions,
} from "@/queryOptions/authQueryOptions";
import type {
    ChangeEmailNewEmailRequest,
    ChangeEmailVerifyOtpRequest,
} from "@/types/api/requests/authRequests";
import type { IGetUserProfileResponse } from "@/types/api/responses/userResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ChangeEmailStep = "requestOtp" | "verifyOtp" | "newEmail";

const emailSchema = z.object({
    newEmail: z.string().email("Please enter a valid email address"),
});

export type EmailFormType = z.infer<typeof emailSchema>;

export function useChangeEmail() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<ChangeEmailStep>("requestOtp");
    const [token, setToken] = useState<string>("");

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { data: userProfile } = useQuery(createGetUserProfileQueryOptions());

    const form = useForm<EmailFormType>({
        resolver: zodResolver(emailSchema),
    });

    const { mutate: requestOtp, isPending: isRequestingOtp } = useMutation(
        createChangeEmailRequestOtpMutationOptions()
    );

    const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation(
        createChangeEmailVerifyOtpMutationOptions()
    );

    const { mutate: submitNewEmail, isPending: isSubmittingEmail } =
        useMutation(createChangeEmailNewEmailMutationOptions());

    const currentEmail = userProfile?.data?.email || "";

    function resetState() {
        setStep("requestOtp");
        setToken("");
        form.reset();
        otpInputRefs.current = [];
    }

    function handleClose() {
        setIsOpen(false);
        resetState();
    }

    function handleOpen() {
        setIsOpen(true);
    }

    function handleRequestOtp() {
        requestOtp(undefined, {
            onSuccess: (response) => {
                toast.success(response.message);
                setStep("verifyOtp");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    }

    function handleResendOtp(onSuccess?: () => void) {
        requestOtp(undefined, {
            onSuccess: (response) => {
                toast.success(response.message);
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    }

    function handleOtpComplete(otp: string) {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        const payload: ChangeEmailVerifyOtpRequest = { otp };

        verifyOtp(payload, {
            onSuccess: (response) => {
                toast.success(response.message);
                const receivedToken = (response.data as { token?: string })
                    ?.token;
                if (receivedToken) {
                    setToken(receivedToken);
                    setStep("newEmail");
                } else {
                    toast.error("Token not received. Please try again.");
                }
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    }

    function handleSubmitNewEmail(data: EmailFormType) {
        if (!token) {
            toast.error("Token expired. Please restart the process.");
            return;
        }

        const payload: ChangeEmailNewEmailRequest = {
            newEmail: data.newEmail,
            token: token,
        };

        submitNewEmail(payload, {
            onSuccess: (response) => {
                toast.success(response.message);

                queryClient.setQueriesData(
                    { queryKey: [QUERY_KEYS.USER_PROFILE] },
                    (
                        prevData:
                            | HttpResponse<IGetUserProfileResponse>
                            | undefined
                    ) => {
                        if (!prevData || !prevData.data) return prevData;

                        const clone = structuredClone(prevData);
                        if (clone.data) {
                            clone.data.email = data.newEmail;
                        }
                        return clone;
                    }
                );

                handleClose();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    }

    return {
        isOpen,
        step,
        currentEmail,
        otpInputRefs,
        form,

        isRequestingOtp,
        isVerifyingOtp,
        isSubmittingEmail,

        handleOpen,
        handleClose,
        handleRequestOtp,
        handleResendOtp,
        handleOtpComplete,
        handleSubmitNewEmail,
    };
}
