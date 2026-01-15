import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
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
import { createHotelMutatationOptions } from "@/queryOptions/hotelQueryOptions";
import { createGetUserProfileQueryOptions } from "@/queryOptions/authQueryOptions";
import HotelIdentitySection from "./HotelIdentitySection";
import VisualAssetsSection from "./VisualAssetsSection";
import AddressLocationSection from "./AddressLocationSection";

function AddHotelForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);

    const {
        data: { data: userData },
    } = useSuspenseQuery(createGetUserProfileQueryOptions());

    const form = useForm<HotelFormValues>({
        resolver: zodResolver(createHotelValidationSchema()) as never,
        defaultValues: {
            name: "",
            description: "",
            country: "",
            city: "",
            landMark: "",
            pinCode: "",
            latitude: undefined,
            longitude: undefined,
        },
    }) as unknown as HotelFormType;

    const { mutate, isPending } = useMutation(createHotelMutatationOptions());

    const onSubmit = (data: HotelFormValues) => {
        return new Promise((res, rej) => {
            if (!coverImage) {
                toast.error(t(translationKey.errors.coverImageRequired));
                rej();
                return;
            }

            if (galleryImages.length < 1) {
                toast.error(
                    t(translationKey.errors.minImagesRequired, { count: 1 })
                );
                rej();
                return;
            }

            const formData = new FormData();

            formData.append("userId", userData?.id || "");
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("coverImage", coverImage);
            galleryImages.forEach((img) => formData.append("images", img));

            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("landMark", data.landMark);
            formData.append("pinCode", data.pinCode);
            formData.append(
                "coordinates",
                JSON.stringify([data.latitude, data.longitude])
            );

            mutate(formData, {
                onSuccess: (result) => {
                    toast.success(result.message);
                    navigate({ to: "/hotel/hotels" });
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

    const handleCancel = () => {
        navigate({ to: "/hotel" });
    };

    return (
        <div className="min-h-screen overflow-scroll bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-10 bg-white/40 backdrop-blur-md border-b border-gray-200 shadow-sm"
            >
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {t(translationKey.headings.addNewHotel)}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {t(
                                        translationKey.headings.addHotelSubtitle
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                {t(translationKey.button.cancel)}
                            </Button>
                            <Button
                                type="submit"
                                form="add-hotel-form"
                                className="bg-gray-900 text-white hover:bg-gray-800"
                                disabled={isPending}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                {isPending
                                    ? t(translationKey.button.submiting)
                                    : t(translationKey.button.submit)}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <form
                    id="add-hotel-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <HotelIdentitySection form={form} />
                    <VisualAssetsSection
                        coverImage={coverImage}
                        galleryImages={galleryImages}
                        onCoverImageChange={handleCoverImageChange}
                        onGalleryImagesAdd={handleGalleryImagesAdd}
                        onGalleryImageRemove={handleGalleryImageRemove}
                    />
                    <AddressLocationSection form={form} />
                </form>
            </div>
        </div>
    );
}

export default AddHotelForm;
