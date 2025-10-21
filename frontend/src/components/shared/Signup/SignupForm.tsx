import type { ROLE } from "@/types/role";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupValidationSchema } from "./validation";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
    createResendOtpQueryOptions,
    createSignupQueryOptions,
    createVerifySignupOtpQueryOptions,
} from "@/queryOptions/authQueryOptions";
import type { HttpResponse } from "@/types/api/responseType";
import type {
    OtpVerifyRequest,
    signupRequest,
} from "@/types/api/requests/authRequests";
import { toast } from "sonner";
import OtpModal from "./OtpModal";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROLES } from "@/constants/roles";

type propType = {
    role: ROLE;
    heading: string;
};
export type signupFormType = z.infer<typeof signupValidationSchema>;
function SignupForm({ role }: propType) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const { mutate: sendOtpMutate } = useMutation<
        HttpResponse<object>,
        Error,
        signupRequest
    >(createSignupQueryOptions());

    const { mutate: verifyOtpMutate } = useMutation<
        HttpResponse<object>,
        Error,
        OtpVerifyRequest
    >(createVerifySignupOtpQueryOptions());

    const { mutate: resendMutate } = useMutation<
        HttpResponse<object>,
        Error,
        string
    >(createResendOtpQueryOptions());

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<signupFormType>({
        resolver: zodResolver(signupValidationSchema),
    });

    const onSubmit: SubmitHandler<signupFormType> = (data): Promise<void> => {
        return new Promise((res, rej) => {
            sendOtpMutate(
                { ...data, role },
                {
                    onSuccess: (response) => {
                        toast.success(response.message);
                        setIsOpen(true);
                        res();
                    },
                    onError: (err) => {
                        console.log(err);
                        toast.error(err.message);
                        rej();
                    },
                }
            );
        });
    };

    function handleVerifyOtp(otp: string) {
        verifyOtpMutate(
            { email: getValues().email, otp },
            {
                onSuccess: (response) => {
                    toast.success(response.message);
                    navigate({
                        to:
                            role == ROLES.TRAVELER
                                ? "/traveler/login"
                                : role === ROLES.CAB
                                  ? "/cab/login"
                                  : "/hotel/login",
                    });
                    console.log(response);
                },
                onError: (err) => {
                    toast.error(err.message);
                    console.log(err);
                },
            }
        );
    }

    function handleOtpResend(): Promise<void> {
        return new Promise((res, rej) => {
            resendMutate(getValues().email, {
                onSuccess: (response) => {
                    toast.success(response.message);
                    res();
                    console.log(response);
                },
                onError: (err) => {
                    toast.error(err.message);
                    rej();
                    console.log(err);
                },
            });
        });
    }

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-2xl space-y-6 "
            >
                <div className="flex flex-col space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.fullname)}
                    </Label>
                    <Input
                        {...register("full_name", { required: true })}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-400 rounded-lg"
                    />
                    <div className="min-h-[1.25rem]">
                        {errors.full_name && (
                            <p className="text-red-500 text-sm">
                                {errors.full_name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.email)}
                    </Label>
                    <Input
                        {...register("email", { required: true })}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-400 rounded-lg"
                    />
                    <div className="min-h-[1.25rem]">
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.password)}
                    </Label>
                    <Input
                        {...register("password", { required: true })}
                        type="password"
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-400 rounded-lg"
                    />
                    <div className="min-h-[1.25rem]">
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.confirmPassword)}
                    </Label>
                    <Input
                        {...register("confirmPassword", { required: true })}
                        type="password"
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-400 rounded-lg"
                    />
                    <div className="min-h-[1.25rem]">
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-3 text-lg font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {t(
                        isSubmitting
                            ? translationKey.button.submiting
                            : translationKey.button.submit
                    )}
                </Button>
            </form>

            <OtpModal
                {...{ isOpen, setIsOpen }}
                handleVerify={handleVerifyOtp}
                handleResendOtp={handleOtpResend}
            />
        </div>
    );
}

export default SignupForm;
