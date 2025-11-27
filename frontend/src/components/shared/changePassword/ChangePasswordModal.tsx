import { useForm, type SubmitHandler } from "react-hook-form";
import Modal from "../modal/Modal";
import z from "zod";
import { validationSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createChangePasswordMutationOptions } from "@/queryOptions/authQueryOptions";
import type { ChangePasswordRequest } from "@/types/api/requests/authRequests";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";

interface ChangePasswordModalProps {
    isOpen: boolean;
    handleClose: () => void;
}
function ChangePasswordModal({
    handleClose,
    isOpen,
}: ChangePasswordModalProps) {
    const { t } = useTranslation();
    type formType = z.infer<typeof validationSchema>;

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<formType>({ resolver: zodResolver(validationSchema) });

    const { mutate } = useMutation(createChangePasswordMutationOptions());

    const onSubmit: SubmitHandler<formType> = (data) => {
        const payload: ChangePasswordRequest = {
            newPassword: data.newPassword,
            oldPassword: data.oldPassword,
        };

        mutate(payload, {
            onSuccess: (response) => {
                toast.success(response.message);
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };
    return (
        <Modal handleClose={handleClose} isOpen={isOpen}>
            <div className="w-full max-w-md mx-auto bg-white p-1">
                <div className="mb-6 text-center space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                        {t(translationKey.form.password)}
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Enter your current password to set a new one.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900">
                            {t(translationKey.form.oldPassword)}
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors duration-200">
                                <LockKeyhole className="h-5 w-5" />
                            </div>
                            <Input
                                type="password"
                                {...register("oldPassword", { required: true })}
                                className="pl-10 h-11 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-0 transition-all rounded-md"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="min-h-[20px] overflow-hidden">
                            <AnimatePresence mode="wait">
                                {errors.oldPassword && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            height: "auto",
                                        }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className="flex items-center gap-2 text-red-600 mt-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                            {errors.oldPassword.message}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-900">
                            {t(translationKey.form.password)}
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors duration-200">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <Input
                                type="password"
                                {...register("newPassword", { required: true })}
                                className="pl-10 h-11 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-0 transition-all rounded-md"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="min-h-[20px] overflow-hidden">
                            <AnimatePresence mode="wait">
                                {errors.newPassword && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            height: "auto",
                                        }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2 text-red-600 mt-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                            {errors.newPassword.message}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-zinc-900">
                            {t(translationKey.form.confirmPassword)}
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-black transition-colors duration-200">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <Input
                                type="password"
                                {...register("confirmPassword", {
                                    required: true,
                                })}
                                className="pl-10 h-11 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-0 transition-all rounded-md"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="min-h-[20px] overflow-hidden">
                            <AnimatePresence mode="wait">
                                {errors.confirmPassword && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            height: "auto",
                                        }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2 text-red-600 mt-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs font-medium">
                                            {errors.confirmPassword.message}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white font-medium tracking-wide transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] rounded-md">
                            {t(translationKey.button.submit)}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ChangePasswordModal;
