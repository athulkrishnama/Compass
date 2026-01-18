import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, getRouteApi } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import {
    createRoomVariantValidationSchema,
    type RoomVariantFormValues,
    type RoomVariantFormType,
} from "@/components/shared/validations/roomVariantSchema";
import { createRoomVariantMutationOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import BasicRoomVariantInfoSection from "@/components/roomVariant/AddRoomVariant/BasicRoomVariantInfoSection";
import OccupancyBeddingSection from "@/components/roomVariant/AddRoomVariant/OccupancyBeddingSection";
import PricingStatusSection from "@/components/roomVariant/AddRoomVariant/PricingStatusSection";
import AmenitiesPoliciesSection from "@/components/roomVariant/AddRoomVariant/AmenitiesPoliciesSection";
import RoomVariantVisualAssetsSection from "@/components/roomVariant/AddRoomVariant/RoomVariantVisualAssetsSection";

const routeApi = getRouteApi("/hotel/hotels/$hotelId_/room-variants/add");

function AddRoomVariantForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { hotelId } = routeApi.useParams();

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);

    const { data: hotelData } = useSuspenseQuery(
        createGetHotelByIdQueryOptions(hotelId)
    );

    const form = useForm<RoomVariantFormValues>({
        resolver: zodResolver(createRoomVariantValidationSchema()) as never,
        values: {
            name: "",
            description: "",
            maxOccupancy: 2,
            bedType: "KING",
            bedCount: 1,
            basePrice: 0,
            amenities: [],
            smokingAllowed: false,
            petsAllowed: false,
            checkInTime: "14:00",
            checkOutTime: "11:00",
        },
    }) as unknown as RoomVariantFormType;

    const { mutate, isPending } = useMutation(
        createRoomVariantMutationOptions()
    );

    const onSubmit = (data: RoomVariantFormValues) => {
        if (!coverImage) {
            toast.error(t(translationKey.errors.coverImageRequired));
            return;
        }

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("maxOccupancy", data.maxOccupancy.toString());
        formData.append(
            "bedConfig",
            JSON.stringify({ type: data.bedType, count: data.bedCount })
        );
        formData.append("amenities", JSON.stringify(data.amenities));
        formData.append(
            "policies",
            JSON.stringify({
                smokingAllowed: data.smokingAllowed,
                petsAllowed: data.petsAllowed,
                checkInTime: data.checkInTime,
                checkOutTime: data.checkOutTime,
            })
        );
        formData.append("basePrice", data.basePrice.toString());
        formData.append("coverImage", coverImage);
        galleryImages.forEach((img) => formData.append("images", img));

        mutate(
            { hotelId, data: formData },
            {
                onSuccess: (result) => {
                    toast.success(result.message);

                    navigate({
                        to: "/hotel/hotels/$hotelId",
                        params: { hotelId },
                    });
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
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
        navigate({ to: "/hotel/hotels/$hotelId", params: { hotelId } });
    };

    return (
        <div className="min-h-screen overflow-scroll bg-gray-50 pb-20">
            <div className="sticky top-6 z-50 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-6xl rounded-2xl border border-gray-200/50 bg-white/50 backdrop-blur-xl shadow-lg"
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
                                        {t(
                                            translationKey.headings
                                                .addNewRoomVariant
                                        )}
                                    </h1>
                                    <p className="hidden sm:block text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                        {hotelData?.data?.name}
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
                                    form="add-room-variant-form"
                                    disabled={isPending}
                                    size="sm"
                                    className="bg-gray-900 text-white hover:bg-gray-800 h-9 px-5 rounded-xl text-xs shadow-md transition-all active:scale-95"
                                >
                                    <Save className="w-3.5 h-3.5 mr-1.5" />
                                    {isPending
                                        ? t(translationKey.button.saving)
                                        : t(
                                              translationKey.button
                                                  .saveRoomVariant
                                          )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <form
                    id="add-room-variant-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <BasicRoomVariantInfoSection form={form} />
                        <OccupancyBeddingSection form={form} />
                        <RoomVariantVisualAssetsSection
                            coverImage={coverImage}
                            galleryImages={galleryImages}
                            onCoverImageChange={handleCoverImageChange}
                            onGalleryImagesAdd={handleGalleryImagesAdd}
                            onGalleryImageRemove={handleGalleryImageRemove}
                        />
                    </div>
                    <div className="space-y-6">
                        <PricingStatusSection form={form} />
                        <AmenitiesPoliciesSection form={form} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRoomVariantForm;
