import type { ROLE } from "@/types/role";
import type z from "zod";
import { loginValidationSchema } from "./validation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createLoginQueryOption } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";
import {  useNavigate } from "@tanstack/react-router";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setUser } from "@/store/slices/userSlice";
import { setToken } from "@/store/slices/tokenSlice";

type propType = {
    role: ROLE;
};
function LoginForm({role}: propType) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    type loginFormType = z.infer<typeof loginValidationSchema>;

    const { mutate } = useMutation(createLoginQueryOption());

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<loginFormType>({
        resolver: zodResolver(loginValidationSchema),
    });

    const onSubmit: SubmitHandler<loginFormType> = (data): Promise<void> => {
        return new Promise((res, rej) => {
            mutate(data, {
                onSuccess: (response) => {
                    console.log(response);

                    if(response.data?.userData.role !== role){
                        toast.error(t(translationKey.text.youAreNotA, {role}))
                        rej();
                        return;
                    }

                    
                    toast.success(response.message);
                    dispatch(
                        setUser({
                            email: response.data?.userData.email!,
                            id: response.data?.userData.id!,
                            full_name: response.data?.userData.full_name!,
                            role: response.data?.userData.role!
                        })
                    );
                    dispatch(setToken(response.data?.accessToken!));


                    navigate({ to: "..", replace: true });
                    res();
                },
                onError: (err) => {
                    console.log(err);
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
                className="bg-white p-8 rounded-2xl space-y-6"
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

                <div className="flex flex-col space-y-2">
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
                
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-3 text-lg font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {t(translationKey.button.signin)}
                </Button>
            </form>
        </div>
    );
}

export default LoginForm;
