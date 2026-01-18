import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
    createRoomVariantValidationSchema,
    type RoomVariantFormValues,
    type RoomVariantFormType,
    BedTypes,
    RoomVariantStatuses,
    RoomAmenities,
} from "@/components/shared/validations/roomVariantSchema";
import {
    createUpdateRoomVariantMutationOptions,
    createDeleteRoomVariantImageMutationOptions,
    createGetRoomVariantByIdQueryOptions,
} from "@/queryOptions/roomVariantQueryOptions";
import type { IRoomVariantDetailResponse } from "@/types/api/responses/roomVariantDetailResponse";
import BasicRoomVariantInfoSection from "../AddRoomVariant/BasicRoomVariantInfoSection";
import OccupancyBeddingSection from "../AddRoomVariant/OccupancyBeddingSection";
import PricingStatusSection from "../AddRoomVariant/PricingStatusSection";
import AmenitiesPoliciesSection from "../AddRoomVariant/AmenitiesPoliciesSection";
import EditRoomVariantVisualAssetsSection from "./EditRoomVariantVisualAssetsSection";
import EditRoomVariantHeader from "./EditRoomVariantHeader";
import { arrayEquals } from "@/utils/array";
import { queryClient } from "@/config/tanstackQueryConfig";

interface EditRoomVariantFormProps {
    roomVariantData: IRoomVariantDetailResponse;
    hotelId: string;
    hotelName: string;
}

function EditRoomVariantForm({
    roomVariantData,
    hotelId,
    hotelName,
}: EditRoomVariantFormProps) {
    const navigate = useNavigate();

    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [deletedGalleryImageIndexes, setDeletedGalleryImageIndexes] =
        useState<number[]>([]);

    const { mutate: deleteImageMutation } = useMutation(
        createDeleteRoomVariantImageMutationOptions()
    );
    const { mutate: updateMutation, isPending } = useMutation(
        createUpdateRoomVariantMutationOptions()
    );

    const form = useForm<RoomVariantFormValues>({
        resolver: zodResolver(createRoomVariantValidationSchema()) as never,
        values: {
            name: roomVariantData.name,
            code: roomVariantData.code,
            description: roomVariantData.description,
            baseOccupancy: roomVariantData.baseOccupancy,
            maxOccupancy: roomVariantData.maxOccupancy,
            bedType: roomVariantData.bedConfig
                .type as (typeof BedTypes)[number],
            bedCount: roomVariantData.bedConfig.count,
            basePrice: roomVariantData.basePrice,
            status: roomVariantData.status as (typeof RoomVariantStatuses)[number],
            amenities:
                roomVariantData.amenities as (typeof RoomAmenities)[number][],
            smokingAllowed: roomVariantData.policies.smokingAllowed,
            petsAllowed: roomVariantData.policies.petsAllowed,
            checkInTime: roomVariantData.policies.checkInTime,
            checkOutTime: roomVariantData.policies.checkOutTime,
        },
    }) as unknown as RoomVariantFormType;

    const onSubmit = (data: RoomVariantFormValues) => {
        const formData = new FormData();

        if (data.name !== roomVariantData.name)
            formData.append("name", data.name);
        if (data.code !== roomVariantData.code)
            formData.append("code", data.code);
        if (data.description !== roomVariantData.description)
            formData.append("description", data.description);
        if (data.baseOccupancy !== roomVariantData.baseOccupancy)
            formData.append("baseOccupancy", data.baseOccupancy.toString());
        if (data.maxOccupancy !== roomVariantData.maxOccupancy)
            formData.append("maxOccupancy", data.maxOccupancy.toString());
        if (data.basePrice !== roomVariantData.basePrice)
            formData.append("basePrice", data.basePrice.toString());
        if (data.status !== roomVariantData.status)
            formData.append("status", data.status);

        if (
            data.bedType !== roomVariantData.bedConfig.type ||
            data.bedCount !== roomVariantData.bedConfig.count
        ) {
            formData.append(
                "bedConfig",
                JSON.stringify({ type: data.bedType, count: data.bedCount })
            );
        }

        if (!arrayEquals(data.amenities, roomVariantData.amenities)) {
            formData.append("amenities", JSON.stringify(data.amenities));
        }

        const currentPolicies = {
            smokingAllowed: data.smokingAllowed,
            petsAllowed: data.petsAllowed,
            checkInTime: data.checkInTime,
            checkOutTime: data.checkOutTime,
        };
        if (
            JSON.stringify(currentPolicies) !==
            JSON.stringify(roomVariantData.policies)
        ) {
            formData.append("policies", JSON.stringify(currentPolicies));
        }

        if (newCoverImage) formData.append("coverImage", newCoverImage);
        newGalleryImages.forEach((img) => formData.append("images", img));

        updateMutation(
            { roomVariantId: roomVariantData.id, data: formData },
            {
                onSuccess: (result) => {
                    toast.success(result.message);
                    queryClient.invalidateQueries({
                        queryKey: createGetRoomVariantByIdQueryOptions(
                            roomVariantData.id
                        ).queryKey,
                    });
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
        deleteImageMutation(
            { roomVariantId: roomVariantData.id, index },
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

    const handleCancel = () => {
        navigate({ to: "/hotel/hotels/$hotelId", params: { hotelId } });
    };

    return (
        <div className="min-h-screen overflow-scroll bg-gray-50 pb-20">
            <EditRoomVariantHeader
                roomVariantName={roomVariantData.name}
                hotelName={hotelName}
                isSubmitting={isPending}
                onCancel={handleCancel}
                formId="edit-room-variant-form"
            />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <form
                    id="edit-room-variant-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <BasicRoomVariantInfoSection form={form} />
                        <OccupancyBeddingSection form={form} />
                        <EditRoomVariantVisualAssetsSection
                            existingCoverImage={roomVariantData.coverImage}
                            existingGalleryImages={roomVariantData.images}
                            newCoverImage={newCoverImage}
                            newGalleryImages={newGalleryImages}
                            onNewCoverImageChange={handleNewCoverImageChange}
                            onNewGalleryImagesAdd={handleNewGalleryImagesAdd}
                            onNewGalleryImageRemove={
                                handleNewGalleryImageRemove
                            }
                            onExistingGalleryImageDelete={
                                handleExistingGalleryImageDelete
                            }
                            deletedGalleryImageIndexes={
                                deletedGalleryImageIndexes
                            }
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

export default EditRoomVariantForm;
