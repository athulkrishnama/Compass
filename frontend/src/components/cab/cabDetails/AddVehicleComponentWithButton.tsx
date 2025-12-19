import Modal from "@/components/shared/modal/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    createVehicleValidationSchema,
    type VehicleFormValues,
} from "@/schemas/vehicleSchema";
import { VEHICLE_TYPES, type VehicleType } from "@/types/vehicleType";
import translationKey from "@/utils/i18n/translationKey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, FileText, Image as ImageIcon, Upload } from "lucide-react";
import ImagePreview from "./ImagePreview";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createUpdateVehicleMutationOption } from "@/queryOptions/cabQueryOptions";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";

interface AddVehicleProps {
    vehicleDetails?: {
        registrationNumber?: string;
        model?: string;
        type?: VehicleType;
        images?: string[];
    };
}

function AddVehicleComponentWithButton({ vehicleDetails }: AddVehicleProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const [previewImages, setPreviewImages] = useState<string[]>(
        vehicleDetails?.images || []
    );
    const [images, setImages] = useState<File[]>([]);
    const { mutate } = useMutation(createUpdateVehicleMutationOption());

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(createVehicleValidationSchema()),
        defaultValues: {
            registrationNumber: vehicleDetails?.registrationNumber || "",
            model: vehicleDetails?.model || "",
            type: vehicleDetails?.type || undefined,
            ...vehicleDetails,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                registrationNumber: vehicleDetails?.registrationNumber || "",
                modelName: vehicleDetails?.model || "",
                type: vehicleDetails?.type || undefined,
                ...vehicleDetails,
            });
            setPreviewImages(vehicleDetails?.images || []);
        }
    }, [open, vehicleDetails, reset, t]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (files[0].size > 1024 * 1024 * 5) {
                toast.error(
                    t(translationKey.errors.maxFileSize, { size: "5MB" })
                );
            } else {
                setImages((prev) => [...prev, ...Array.from(files)]);
                setPreviewImages((prev) => [
                    ...prev,
                    ...Array.from(files).map((file) =>
                        URL.createObjectURL(file)
                    ),
                ]);
            }
        }
    };

    const onFormSubmit = (data: VehicleFormValues) => {
        return new Promise((res, rej) => {
            const formData = new FormData();

            if (data.modelName) formData.append("model", data.modelName);
            if (data.type) formData.append("type", data.type);
            if (data.registrationNumber)
                formData.append("registrationNumber", data.registrationNumber);

            if (images.length > 0) {
                for (const img of images) {
                    formData.append("images", img);
                }
            }

            mutate(formData, {
                onSuccess: (response) => {
                    toast.success(response.message);
                    setOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.CAB_DETAILS],
                    });
                    res("success")
                },
                onError: (err) => {
                    toast.error(err.message);
                    rej(err)
                },
            });
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className="gap-2">
                {vehicleDetails ? (
                    <>
                        <Car className="w-4 h-4" />{" "}
                        {t(translationKey.button.editVehicle)}
                    </>
                ) : (
                    t(translationKey.button.addVehicle)
                )}
            </Button>
            <Modal isOpen={open} handleClose={() => setOpen(false)}>
                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {t(translationKey.button.addVehicle)}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {t(translationKey.text.submitDetails)}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="registrationNumber"
                                className="flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4 text-gray-500" />
                                {t(translationKey.text.registrationNumber)}
                            </Label>
                            <Input
                                id="registrationNumber"
                                placeholder="e.g. KL-01-AB-1234"
                                {...register("registrationNumber")}
                                className={
                                    errors.registrationNumber
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {errors.registrationNumber && (
                                <p className="text-red-500 text-xs">
                                    {
                                        errors.registrationNumber
                                            .message as string
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="modelName"
                                className="flex items-center gap-2"
                            >
                                <Car className="w-4 h-4 text-gray-500" />
                                {t(translationKey.text.modelName)}{" "}
                            </Label>
                            <Input
                                id="modelName"
                                placeholder="e.g. Toyota Innova"
                                {...register("modelName")}
                                className={
                                    errors.modelName ? "border-red-500" : ""
                                }
                            />
                            {errors.modelName && (
                                <p className="text-red-500 text-xs">
                                    {errors.modelName.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="type"
                                className="flex items-center gap-2"
                            >
                                <Car className="w-4 h-4 text-gray-500" />
                                {t(translationKey.text.vehicleType)}{" "}
                            </Label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.type
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue
                                                placeholder={t(
                                                    translationKey.text
                                                        .vehicleType
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {VEHICLE_TYPES.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className="capitalize"
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && (
                                <p className="text-red-500 text-xs">
                                    {errors.type.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="images"
                                className="flex items-center gap-2"
                            >
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                                {t(translationKey.text.vehicleImage)}
                            </Label>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="dropzone-file"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    {t(
                                                        translationKey.button
                                                            .upload
                                                    )}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                SVG, PNG, JPG or WEBP (MAX. 5MB)
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>

                                <ImagePreview previewImages={previewImages} />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t(translationKey.button.submiting)
                                : t(translationKey.button.addVehicle)}
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default AddVehicleComponentWithButton;
