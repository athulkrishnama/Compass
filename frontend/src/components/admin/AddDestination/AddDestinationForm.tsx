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
import BasicInfoSection from "./BasicInfoSection";
import ImageGallerySection from "./ImageGallerySection";
import LocationMapSection from "./LocationMapSection";
import DetailsClassificationSection from "./DetailsClassificationSection";
import VisitingHoursSection from "./VisitingHoursSection";
import AccessibilitySection from "./AccessibilitySection";
import EntryFeeSection from "./EntryFeeSection";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createAddDestinationMutationOption } from "@/queryOptions/destinationQueryOptions";

function AddDestinationForm() {
    const { t } = useTranslation();

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);

    const navigate = useNavigate();

    const form = useForm<DestinationFormValues>({
        resolver: zodResolver(createDestinationValidationSchema()) as never,
        defaultValues: {
            name: "",
            tagline: "",
            description: "",
            country: "",
            city: "",
            pincode: "",
            latitude: undefined,
            longitude: undefined,
            destinationType: undefined,
            activities: [],
            bestMonths: [],
            isAlwaysOpen: false,
            openingTime: "",
            closingTime: "",
            closedDays: [],
            wheelchairAccessible: false,
            isFree: true,
            entryFeeAmount: undefined,
            entryFeeCurrency: undefined,
        },
    }) as unknown as DestinationFormType;

    const { mutate } = useMutation(createAddDestinationMutationOption());

    const onSubmit = (data: DestinationFormValues) => {
        return new Promise((res, rej) => {
            if (!coverImage) {
                toast.error(t(translationKey.errors.coverImageRequired));
                rej();
                return;
            }

            if (galleryImages.length < 4) {
                toast.error(
                    t(translationKey.errors.minImagesRequired, {
                        count: 4,
                    })
                );
                rej();
                return;
            }

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("tagline", data.tagline);
            formData.append("description", data.description);
            formData.append("coverImage", coverImage!);
            galleryImages.map((img) => formData.append("images", img));

            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("pincode", data.pincode);
            formData.append(
                "coordinates",
                JSON.stringify([data.latitude, data.longitude])
            );

            formData.append("type", data.destinationType);
            formData.append("activities", JSON.stringify(data.activities));
            formData.append("bestTimeToVisit", JSON.stringify(data.bestMonths));

            formData.append(
                "isAlwaysOpen",
                data.isAlwaysOpen ? "true" : "false"
            );
            formData.append(
                "isWheelChairAccessible",
                data.wheelchairAccessible ? "true" : "false"
            );
            formData.append("isFree", data.isFree ? "true" : "false");

            if (!data.isAlwaysOpen) {
                formData.append("openingTime", `${data.openingTime}`);
                formData.append("closingTime", `${data.closingTime}`);
                formData.append("closedDays", JSON.stringify(data.closedDays));
            }

            if (!data.isFree) {
                formData.append("entryFee", `${data.entryFeeAmount}`);
                formData.append("currency", `${data.entryFeeCurrency}`);
            }

            mutate(formData, {
                onSuccess: (result) => {
                    toast.success(result.message);
                    navigate({ to: "/admin/destinations" });
                    res("success");
                },
                onError: (err) => {
                    toast.error(err.message);
                    rej(err);
                },
            });
        });
    };

    const handleCoverImageChange = (file: File | null) => {
        setCoverImage(file);
    };

    const handleGalleryImagesAdd = (files: File[]) => {
        setGalleryImages((prev) => [...prev, ...files]);
    };

    const handleGalleryImageRemove = (index: number) => {
        setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <ImageGallerySection
                coverImage={coverImage}
                galleryImages={galleryImages}
                onCoverImageChange={handleCoverImageChange}
                onGalleryImagesAdd={handleGalleryImagesAdd}
                onGalleryImageRemove={handleGalleryImageRemove}
            />
            <LocationMapSection form={form} />
            <DetailsClassificationSection form={form} />
            <VisitingHoursSection form={form} />
            <AccessibilitySection form={form} />
            <EntryFeeSection form={form} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end"
            >
                <Button
                    type="submit"
                    className="px-8 py-2 bg-gray-900 text-white hover:bg-gray-800"
                    disabled={form.formState.isSubmitting}
                >
                    {t(translationKey.button.submit)}
                </Button>
            </motion.div>
        </form>
    );
}

export default AddDestinationForm;
