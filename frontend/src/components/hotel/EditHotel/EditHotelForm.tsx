import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import {
    createHotelValidationSchema,
    type HotelFormValues,
    type HotelFormType,
} from "@/components/shared/validations/hotelSchema";
import {
    createUpdateHotelMutationOptions,
    createDeleteHotelImageMutationOptions,
} from "@/queryOptions/hotelQueryOptions";
import HotelIdentitySection from "../AddHotel/HotelIdentitySection";
import AddressLocationSection from "../AddHotel/AddressLocationSection";
import EditVisualAssetsSection from "./EditVisualAssetsSection";
import type { IGetHotelByIdResponse } from "@/types/api/responses/getHotelById";

interface EditHotelFormProps {
    hotelData: IGetHotelByIdResponse;
}

export function EditHotelForm({ hotelData }: EditHotelFormProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [deletedGalleryImageIndexes, setDeletedGalleryImageIndexes] =
        useState<number[]>([]);

    const { mutate: deleteMutation } = useMutation(
        createDeleteHotelImageMutationOptions()
    );
    const { mutate, isPending } = useMutation(
        createUpdateHotelMutationOptions()
    );

    const form = useForm<HotelFormValues>({
        resolver: zodResolver(createHotelValidationSchema()) as never,
        values: {
            name: hotelData.name,
            description: hotelData.description,
            country: hotelData.country,
            city: hotelData.city,
            landMark: hotelData.landMark,
            pinCode: hotelData.pinCode,
            latitude: hotelData.coordinates[0],
            longitude: hotelData.coordinates[1],
        },
    }) as unknown as HotelFormType;

    const onSubmit = (data: HotelFormValues) => {
        const updatePayload = {
            ...(data.name !== hotelData.name && { name: data.name }),
            ...(data.description !== hotelData.description && {
                description: data.description,
            }),
            ...(data.country !== hotelData.country && {
                country: data.country,
            }),
            ...(data.city !== hotelData.city && { city: data.city }),
            ...(data.landMark !== hotelData.landMark && {
                landMark: data.landMark,
            }),
            ...(data.pinCode !== hotelData.pinCode && {
                pinCode: data.pinCode,
            }),
            ...(data.latitude !== hotelData.coordinates[0] && {
                latitude: data.latitude,
            }),
            ...(data.longitude !== hotelData.coordinates[1] && {
                longitude: data.longitude,
            }),
            ...(newCoverImage && { coverImage: newCoverImage }),
            ...(newGalleryImages.length > 0 && { images: newGalleryImages }),
        };

        const formData = new FormData();

        for (const key in updatePayload) {
            const value = updatePayload[key as keyof typeof updatePayload];
            if (key === "images" || key === "coverImage") {
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                formData.append(key, String(value));
            } else if (value) {
                formData.append(key, JSON.stringify(value));
            }
        }

        newGalleryImages.forEach((image) => formData.append("images", image));
        if (newCoverImage) formData.append("coverImage", newCoverImage);

        if (
            data.latitude !== hotelData.coordinates[0] ||
            data.longitude !== hotelData.coordinates[1]
        ) {
            formData.append(
                "coordinates",
                JSON.stringify([data.latitude, data.longitude])
            );
        }

        mutate(
            { id: hotelData.id, data: formData },
            {
                onSuccess: (res) => {
                    navigate({ to: "/hotel/hotels" });
                    toast.success(res.message);
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    const handleNewCoverImageChange = (file: File | null) => {
        setNewCoverImage(file);
    };

    const handleNewGalleryImagesAdd = (files: File[]) => {
        setNewGalleryImages((prev) => [...prev, ...files]);
    };

    const handleNewGalleryImageRemove = (index: number) => {
        setNewGalleryImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleExistingGalleryImageDelete = (originalIndex: number) => {
        const deletedLowerCount = deletedGalleryImageIndexes.filter(
            (deletedIdx) => deletedIdx < originalIndex
        ).length;
        const adjustedIndex = originalIndex - deletedLowerCount;

        deleteMutation(
            { id: hotelData.id, index: adjustedIndex },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    setDeletedGalleryImageIndexes((prev) => [
                        ...prev,
                        originalIndex,
                    ]);
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    const handleCancel = () => {
        navigate({ to: "/hotel/hotels" });
    };

    return (
        <div className="min-h-screen overflow-scroll bg-gray-50 pb-20">
            <div className="sticky top-6 z-50 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-4xl rounded-2xl border border-gray-200/50 bg-white/50 backdrop-blur-xl shadow-lg"
                >
                    <div className="px-5 py-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col">
                                    <h1 className="font-bold text-gray-900 text-sm sm:text-base">
                                        {t(translationKey.headings.editHotel)}:{" "}
                                        {hotelData.name}
                                    </h1>
                                    <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                        {t(translationKey.text.existingEntry)} ·
                                        ID #{hotelData.id.slice(-8)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleCancel}
                                    size="sm"
                                    className="h-9 text-xs px-4"
                                >
                                    {t(translationKey.button.cancel)}
                                </Button>
                                <Button
                                    type="submit"
                                    form="edit-hotel-form"
                                    disabled={isPending}
                                    size="sm"
                                    className="bg-gray-900 text-white hover:bg-gray-800 h-9 px-5 rounded-xl text-xs shadow-md transition-all active:scale-95"
                                >
                                    <Check className="w-3.5 h-3.5 mr-1.5" />
                                    {isPending
                                        ? t(translationKey.button.updating)
                                        : t(translationKey.button.updateHotel)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <form
                    id="edit-hotel-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <HotelIdentitySection form={form} />
                    <EditVisualAssetsSection
                        existingCoverImage={hotelData.coverImage}
                        existingGalleryImages={hotelData.images}
                        newCoverImage={newCoverImage}
                        newGalleryImages={newGalleryImages}
                        onNewCoverImageChange={handleNewCoverImageChange}
                        onNewGalleryImagesAdd={handleNewGalleryImagesAdd}
                        onNewGalleryImageRemove={handleNewGalleryImageRemove}
                        onExistingGalleryImageDelete={
                            handleExistingGalleryImageDelete
                        }
                        deletedGalleryImageIndexes={deletedGalleryImageIndexes}
                    />
                    <AddressLocationSection form={form} />
                </form>
            </div>
        </div>
    );
}

export default EditHotelForm;
