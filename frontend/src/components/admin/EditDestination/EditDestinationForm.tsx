import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import {
    createDestinationValidationSchema,
    type DestinationFormValues,
    type DestinationFormType,
} from "@/components/shared/validations/destinationSchema";
import BasicInfoSection from "../AddDestination/BasicInfoSection";
import LocationMapSection from "../AddDestination/LocationMapSection";
import DetailsClassificationSection from "../AddDestination/DetailsClassificationSection";
import VisitingHoursSection from "../AddDestination/VisitingHoursSection";
import AccessibilitySection from "../AddDestination/AccessibilitySection";
import EntryFeeSection from "../AddDestination/EntryFeeSection";
import EditImageGallerySection from "./EditImageGallerySection";
import type { IFindDestinationResponseDTO } from "@/types/api/responses/findDestinationResponse";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import { useMutation } from "@tanstack/react-query";
import {
    createDeleteDestinationImageMutationOption,
    createUpdateDestinationMutationOption,
} from "@/queryOptions/adminQueryOptions";
import { toast } from "sonner";
import { arrayEquals } from "@/utils/array";
import { useNavigate } from "@tanstack/react-router";

interface EditDestinationFormProps {
    destinationData: IFindDestinationResponseDTO;
}

function EditDestinationForm({ destinationData }: EditDestinationFormProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutate: deleteMutation } = useMutation(
        createDeleteDestinationImageMutationOption()
    );
    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);

    const [deletedGalleryImageIndexes, setDeletedGalleryImageIndexes] =
        useState<number[]>([]);

    const { mutate } = useMutation(createUpdateDestinationMutationOption());

    const form = useForm<DestinationFormValues>({
        resolver: zodResolver(createDestinationValidationSchema()) as never,
        values: {
            name: destinationData.name,
            tagline: destinationData.tagline,
            description: destinationData.description,
            country: destinationData.country,
            city: destinationData.city,
            pincode: destinationData.pincode,
            latitude: destinationData.coordinates[0],
            longitude: destinationData.coordinates[1],
            destinationType: destinationData.type as DESTINATION_TYPES,
            activities: destinationData.activities || [],
            bestMonths: destinationData.bestTimeToVisit || [],
            isAlwaysOpen: destinationData.isAlwaysOpen,
            openingTime: destinationData.openingTime || "",
            closingTime: destinationData.closingTime || "",
            closedDays: destinationData.closedDays || [],
            wheelchairAccessible: destinationData.isWheelChairAccessible,
            isFree: destinationData.isFree,
            entryFeeAmount: destinationData.entryFee,
            entryFeeCurrency: destinationData.currency,
        },
    }) as unknown as DestinationFormType;

    const onSubmit = (data: DestinationFormValues) => {
        const updatePayLoad = {
            ...(data.name !== destinationData.name && { name: data.name }),
            ...(data.tagline !== destinationData.tagline && {
                tagline: data.tagline,
            }),
            ...(data.description !== destinationData.description && {
                description: data.description,
            }),
            ...(data.country !== destinationData.country && {
                country: data.country,
            }),
            ...(data.city !== destinationData.city && { city: data.city }),
            ...(data.pincode !== destinationData.pincode && {
                pincode: data.pincode,
            }),
            ...(data.latitude !== destinationData.coordinates[0] && {
                latitude: data.latitude,
            }),
            ...(data.longitude !== destinationData.coordinates[1] && {
                longitude: data.longitude,
            }),
            ...(data.destinationType !== destinationData.type && {
                type: data.destinationType,
            }),
            ...(!arrayEquals(data.activities!, destinationData.activities) && {
                activities: data.activities,
            }),
            ...(!arrayEquals(
                data.bestMonths!,
                destinationData.bestTimeToVisit
            ) && {
                bestTimeToVisit: data.bestMonths,
            }),
            ...(data.isAlwaysOpen !== destinationData.isAlwaysOpen && {
                isAlwaysOpen: data.isAlwaysOpen,
            }),
            ...(data.openingTime !== destinationData.openingTime && {
                openingTime: data.openingTime,
            }),
            ...(data.closingTime !== destinationData.closingTime && {
                closingTime: data.closingTime,
            }),
            ...(!arrayEquals(data.closedDays!, destinationData.closedDays!) && {
                closedDays: data.closedDays,
            }),
            ...(data.wheelchairAccessible !==
                destinationData.isWheelChairAccessible && {
                isWheelChairAccessible: data.wheelchairAccessible,
            }),
            ...(data.isFree !== destinationData.isFree && {
                isFree: data.isFree,
            }),
            ...(data.entryFeeAmount !== destinationData.entryFee && {
                entryFee: data.entryFeeAmount,
            }),
            ...(data.entryFeeCurrency !== destinationData.currency && {
                currency: data.entryFeeCurrency,
            }),

            ...(newCoverImage && { coverImage: newCoverImage }),
            ...(newGalleryImages.length > 0 && { images: newGalleryImages }),
        };

        const formData = new FormData();

        for (const key in updatePayLoad) {
            const value = updatePayLoad[key as keyof typeof updatePayLoad];
            if (key === "images" || key === "coverImage") {
                continue;
            }
            if (typeof value === "string") {
                formData.append(key, value);
            } else {
                formData.append(key, JSON.stringify(value));
            }
        }

        newGalleryImages.forEach((image) => formData.append("images", image));
        if (newCoverImage) formData.append("coverImage", newCoverImage);

        mutate(
            { id: destinationData.id, data: formData },
            {
                onSuccess: (res) => {
                    navigate({ to: "/admin/destinations" });
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

    const handleExistingGalleryImageDelete = (index: number) => {
        deleteMutation(
            { id: destinationData.id, index },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    setDeletedGalleryImageIndexes((prev) => [...prev, index]);
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 relative"
        >
            <div className="sticky top-0 z-50 bg-white/50 dark:bg-gray-900/50 ">
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/30 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-2 rounded-2xl shadow-xl flex justify-between items-center"
                >
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate({ to: "/admin/destinations" })}
                        className="text-gray-600 hover:text-gray-900 font-medium px-4 h-10"
                    >
                        {t(translationKey.button.cancel)}
                    </Button>
                    <Button
                        type="submit"
                        className="px-6 h-10 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-medium shadow-lg"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? t(translationKey.button.updating)
                            : t(translationKey.button.update)}
                    </Button>
                </motion.div>
            </div>
            <BasicInfoSection form={form} />
            <EditImageGallerySection
                existingCoverImage={destinationData.coverImage}
                existingGalleryImages={destinationData.images}
                newCoverImage={newCoverImage}
                newGalleryImages={newGalleryImages}
                onNewCoverImageChange={handleNewCoverImageChange}
                onNewGalleryImagesAdd={handleNewGalleryImagesAdd}
                onNewGalleryImageRemove={handleNewGalleryImageRemove}
                onExistingGalleryImageDelete={handleExistingGalleryImageDelete}
                deletedGalleryImageIndexes={deletedGalleryImageIndexes}
            />
            <LocationMapSection form={form} />
            <DetailsClassificationSection form={form} />
            <VisitingHoursSection form={form} />
            <AccessibilitySection form={form} />
            <EntryFeeSection form={form} />
        </form>
    );
}

export default EditDestinationForm;
