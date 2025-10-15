import z from "zod";
import { emailValidationSchema } from "../validations/emailValidation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createForgetPasswordSendOtpQueryOptions } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";

type propType = {
    onComplete: (email: string) => void;
};

function Stage1({ onComplete }: propType) {
    const { t } = useTranslation();
    const validationSchema = z.object({
        email: emailValidationSchema,
    });

    type formType = z.infer<typeof validationSchema>;

    const { mutate } = useMutation(createForgetPasswordSendOtpQueryOptions());
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<formType>({
        resolver: zodResolver(validationSchema),
    });

    const onSubmit: SubmitHandler<formType> = (data): Promise<void> => {
        return new Promise((res, rej) => {
            mutate(data.email, {
                onSuccess: (response) => {
                    toast.success(response.message);
                    onComplete(data.email);
                    res();
                },
                onError: (err) => {
                    toast.error(err.message);
                    rej();
                },
            });
        });
    };

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-2xl  space-y-6"
            >
                <div className="flex flex-col space-y-2">
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

                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-3 text-lg font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200"
                >
                    {t(translationKey.button.sendOtp)}
                </Button>
            </form>
        </div>
    );
}

export default Stage1;
