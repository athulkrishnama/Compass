import { createForgetPasswordResetPasswordQueryOptions } from "@/queryOptions/authQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type z from "zod";
import { resetPasswordValidation } from "./validation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type propType = {
    token: string;
    email: string;
    onComplete: () => void;
};
function Stage3({ email, token, onComplete }: propType) {
    const { t } = useTranslation();

    const { mutate } = useMutation(
        createForgetPasswordResetPasswordQueryOptions()
    );

    type formType = z.infer<typeof resetPasswordValidation>;

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<formType>({
        resolver: zodResolver(resetPasswordValidation),
    });

    const onSubmit: SubmitHandler<formType> = (data): Promise<void> => {
        return new Promise((res, rej) => {
            mutate(
                { email, token, password: data.newPassword },
                {
                    onSuccess: (response) => {
                        toast.success(response.message);
                        onComplete();
                        res();
                    },
                    onError: (err) => {
                        toast.error(err.message);
                        rej();
                    },
                }
            );
        });
    };
    return (
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl  max-w-md w-full mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                {t(translationKey.headings.resetPassword)}
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col space-y-5"
            >
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.newPassword)}
                    </Label>
                    <Input
                        type="password"
                        {...register("newPassword", { required: true })}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-red-500">
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700 font-medium">
                        {t(translationKey.form.confirmPassword)}
                    </Label>
                    <Input
                        type="password"
                        {...register("confirmPassword", { required: true })}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {t(translationKey.button.reset)}
                </Button>
            </form>
        </div>
    );
}

export default Stage3;
