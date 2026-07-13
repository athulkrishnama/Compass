import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import type {
    IUnAvailableRoom,
    IRoomVariantDetailResponse,
    RoomStatus,
} from "@/types/api/responses/roomVariantDetailResponse";
import MarkUnavailableModal from "./MarkUnavailableModal";
import EditUnavailableModal from "./EditUnavailableModal";
import UnavailableRoomCard from "./UnavailableRoomCard";
import { useMutation } from "@tanstack/react-query";
import {
    createGetRoomVariantByIdQueryOptions,
    createMarkRoomAsUnavailableMutationOptions,
    createUpdateRoomUnavailabilityMutationOptions,
    createRestoreRoomMutationOptions,
} from "@/queryOptions/roomVariantQueryOptions";
import { toast } from "sonner";
import { queryClient } from "@/config/tanstackQueryConfig";
import type { HttpResponse } from "@/types/api/responseType";

interface RoomInstancesSectionProps {
    roomVariantId: string;
    roomVariant: IRoomVariantDetailResponse;
}

export default function RoomInstancesSection({
    roomVariant,
}: RoomInstancesSectionProps) {
    const { t } = useTranslation();
    const [isMarkUnavailableOpen, setIsMarkUnavailableOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IUnAvailableRoom | null>(
        null
    );

    const { mutate: markRoomAsUnavailableMutation } = useMutation(
        createMarkRoomAsUnavailableMutationOptions()
    );

    const { mutate: updateRoomUnavailabilityMutation } = useMutation(
        createUpdateRoomUnavailabilityMutationOptions()
    );

    const { mutate: restoreRoomMutation } = useMutation(
        createRestoreRoomMutationOptions()
    );

    const handleMarkUnavailable = (data: {
        roomNumber: string;
        status: RoomStatus;
        reason: string;
        startDate: string;
        endDate: string;
    }) => {
        markRoomAsUnavailableMutation(
            {
                roomVariantId: roomVariant.id,
                roomNumber: Number(data.roomNumber),
                status: data.status,
                reason: data.reason,
                startDate: data.startDate,
                endDate: data.endDate,
            },
            {
                onSuccess: (res) => {
                    queryClient.setQueriesData(
                        createGetRoomVariantByIdQueryOptions(roomVariant.id),
                        (oldData: HttpResponse<IRoomVariantDetailResponse>) => {
                            const duplicate = structuredClone(oldData);
                            const { id } = res.data!;
                            duplicate?.data?.unAvailableRooms.push({
                                id: id!,
                                roomNumber: Number(data.roomNumber),
                                status: data.status,
                                reason: data.reason,
                                startDate: data.startDate,
                                endDate: data.endDate,
                            });
                            return duplicate;
                        }
                    );
                    toast.success(res.message);
                },
                onError: (error) => {
                    toast.error(error.message);
                },
                onSettled: () => {
                    setIsMarkUnavailableOpen(false);
                },
            }
        );
    };

    const handleRestore = (room: IUnAvailableRoom) => {
        restoreRoomMutation(room.id, {
            onSuccess: (res) => {
                queryClient.setQueriesData(
                    createGetRoomVariantByIdQueryOptions(roomVariant.id),
                    (oldData: HttpResponse<IRoomVariantDetailResponse>) => {
                        const duplicate = structuredClone(oldData);
                        if (duplicate?.data) {
                            duplicate.data.unAvailableRooms =
                                duplicate.data.unAvailableRooms.filter(
                                    (r) => r.id !== room.id
                                );
                        }
                        return duplicate;
                    }
                );
                toast.success(res.message);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const handleEdit = (room: IUnAvailableRoom) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };

    const handleUpdateRoom = (data: {
        id: string;
        status: RoomStatus;
        reason: string;
        startDate: string;
        endDate: string;
    }) => {
        updateRoomUnavailabilityMutation(data, {
            onSuccess: (res) => {
                queryClient.setQueriesData(
                    createGetRoomVariantByIdQueryOptions(roomVariant.id),
                    (oldData: HttpResponse<IRoomVariantDetailResponse>) => {
                        const duplicate = structuredClone(oldData);
                        const roomIndex =
                            duplicate?.data?.unAvailableRooms.findIndex(
                                (r) => r.id === data.id
                            );
                        if (
                            roomIndex !== undefined &&
                            roomIndex !== -1 &&
                            duplicate?.data
                        ) {
                            duplicate.data.unAvailableRooms[roomIndex] = {
                                ...duplicate.data.unAvailableRooms[roomIndex],
                                status: data.status,
                                reason: data.reason,
                                startDate: data.startDate,
                                endDate: data.endDate,
                            };
                        }
                        return duplicate;
                    }
                );
                toast.success(res.message);
            },
            onError: (error) => {
                toast.error(error.message);
            },
            onSettled: () => {
                setIsEditModalOpen(false);
                setSelectedRoom(null);
            },
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {roomVariant.name}
                        </h2>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                            ID: {roomVariant.roomPrefix}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        {roomVariant.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DetailItem
                            label={t(translationKey.form.roomPrefix)}
                            value={roomVariant.roomPrefix}
                        />
                        <DetailItem
                            label={t(translationKey.text.maxOccupancy)}
                            value={roomVariant.maxOccupancy}
                        />
                        <DetailItem
                            label={t(translationKey.text.bedding)}
                            value={`${roomVariant.bedConfig.count} ${roomVariant.bedConfig.type}`}
                        />
                        <DetailItem
                            label={t(translationKey.text.basePrice)}
                            value={
                                <>
                                    {" "}
                                    ₹{roomVariant.basePrice.toLocaleString()}{" "}
                                    <span className="text-xs text-gray-500">
                                        {t(translationKey.text.perNight)}
                                    </span>
                                </>
                            }
                        />
                        <DetailItem
                            label={t(translationKey.form.totalRooms)}
                            value={roomVariant.totalRooms}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                            {t(translationKey.text.operationalStatus)}
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                            {roomVariant.unAvailableRooms.length}{" "}
                            {t(translationKey.text.unavailableRooms)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hide-scroll-bar">
                    {roomVariant.unAvailableRooms.map((room) => (
                        <UnavailableRoomCard
                            key={room.roomNumber}
                            room={room}
                            roomPrefix={roomVariant.roomPrefix}
                            onEdit={handleEdit}
                            onRestore={handleRestore}
                        />
                    ))}

                    <button
                        onClick={() => setIsMarkUnavailableOpen(true)}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center min-h-[160px] group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-3 transition-colors">
                            <Plus className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 text-center">
                            {t(translationKey.text.markUnavailable)}
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-1">
                            {t(translationKey.text.maintenanceCleaningEtc)}
                        </p>
                    </button>
                </div>
            </div>

            <MarkUnavailableModal
                isOpen={isMarkUnavailableOpen}
                totalRoom={roomVariant.totalRooms}
                handleClose={() => setIsMarkUnavailableOpen(false)}
                roomPrefix={roomVariant.roomPrefix}
                onSubmit={handleMarkUnavailable}
            />
            <EditUnavailableModal
                isOpen={isEditModalOpen}
                handleClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedRoom(null);
                }}
                roomPrefix={roomVariant.roomPrefix}
                room={selectedRoom}
                onSubmit={handleUpdateRoom}
            />
        </>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className="text-base font-semibold text-gray-900">{value}</p>
        </div>
    );
}
