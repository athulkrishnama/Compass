import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
    createRoomValidationSchema,
    type RoomFormValues,
    type RoomFormType,
    BedTypes,
    RoomStatuses,
    RoomAmenities,
} from "@/components/shared/validations/roomSchema";
import {
    createUpdateRoomMutationOptions,
    createDeleteRoomImageMutationOptions,
    createGetRoomByIdQueryOptions,
} from "@/queryOptions/roomQueryOptions";
import type { IRoomDetailResponse } from "@/types/api/responses/roomDetailResponse";
import BasicRoomInfoSection from "../AddRoom/BasicRoomInfoSection";
import OccupancyBeddingSection from "../AddRoom/OccupancyBeddingSection";
import PricingStatusSection from "../AddRoom/PricingStatusSection";
import AmenitiesPoliciesSection from "../AddRoom/AmenitiesPoliciesSection";
import EditRoomVisualAssetsSection from "./EditRoomVisualAssetsSection";
import EditRoomHeader from "./EditRoomHeader";
import { arrayEquals } from "@/utils/array";
import { queryClient } from "@/config/tanstackQueryConfig";

interface EditRoomFormProps {
    roomData: IRoomDetailResponse;
    hotelId: string;
    hotelName: string;
}

function EditRoomForm({ roomData, hotelId, hotelName }: EditRoomFormProps) {
    const navigate = useNavigate();

    const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [deletedGalleryImageIndexes, setDeletedGalleryImageIndexes] =
        useState<number[]>([]);

    const { mutate: deleteImageMutation } = useMutation(
        createDeleteRoomImageMutationOptions()
    );
    const { mutate: updateMutation, isPending } = useMutation(
        createUpdateRoomMutationOptions()
    );

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(createRoomValidationSchema()) as never,
        values: {
            name: roomData.name,
            code: roomData.code,
            description: roomData.description,
            baseOccupancy: roomData.baseOccupancy,
            maxOccupancy: roomData.maxOccupancy,
            bedType: roomData.bedConfig.type as (typeof BedTypes)[number],
            bedCount: roomData.bedConfig.count,
            basePrice: roomData.basePrice,
            status: roomData.status as (typeof RoomStatuses)[number],
            amenities: roomData.amenities as (typeof RoomAmenities)[number][],
            smokingAllowed: roomData.policies.smokingAllowed,
            petsAllowed: roomData.policies.petsAllowed,
            checkInTime: roomData.policies.checkInTime,
            checkOutTime: roomData.policies.checkOutTime,
        },
    }) as unknown as RoomFormType;

    const onSubmit = (data: RoomFormValues) => {
        const formData = new FormData();

        if (data.name !== roomData.name) formData.append("name", data.name);
        if (data.code !== roomData.code) formData.append("code", data.code);
        if (data.description !== roomData.description)
            formData.append("description", data.description);
        if (data.baseOccupancy !== roomData.baseOccupancy)
            formData.append("baseOccupancy", data.baseOccupancy.toString());
        if (data.maxOccupancy !== roomData.maxOccupancy)
            formData.append("maxOccupancy", data.maxOccupancy.toString());
        if (data.basePrice !== roomData.basePrice)
            formData.append("basePrice", data.basePrice.toString());
        if (data.status !== roomData.status)
            formData.append("status", data.status);

        if (
            data.bedType !== roomData.bedConfig.type ||
            data.bedCount !== roomData.bedConfig.count
        ) {
            formData.append(
                "bedConfig",
                JSON.stringify({ type: data.bedType, count: data.bedCount })
            );
        }

        if (!arrayEquals(data.amenities, roomData.amenities)) {
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
            JSON.stringify(roomData.policies)
        ) {
            formData.append("policies", JSON.stringify(currentPolicies));
        }

        if (newCoverImage) formData.append("coverImage", newCoverImage);
        newGalleryImages.forEach((img) => formData.append("images", img));

        updateMutation(
            { roomId: roomData.id, data: formData },
            {
                onSuccess: (result) => {
                    toast.success(result.message);
                    queryClient.invalidateQueries({
                        queryKey: createGetRoomByIdQueryOptions(roomData.id)
                            .queryKey,
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
            { roomId: roomData.id, index },
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
            <EditRoomHeader
                roomName={roomData.name}
                hotelName={hotelName}
                isSubmitting={isPending}
                onCancel={handleCancel}
                formId="edit-room-form"
            />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <form
                    id="edit-room-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <BasicRoomInfoSection form={form} />
                        <OccupancyBeddingSection form={form} />
                        <EditRoomVisualAssetsSection
                            existingCoverImage={roomData.coverImage}
                            existingGalleryImages={roomData.images}
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

export default EditRoomForm;
