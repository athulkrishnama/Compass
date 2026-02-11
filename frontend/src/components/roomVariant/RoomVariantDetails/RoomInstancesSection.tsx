import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Wrench, Ban, Pencil } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import type {
    IUnAvailableRoom,
    IRoomVariantDetailResponse,
    RoomStatus,
} from "@/types/api/responses/roomVariantDetailResponse";
import MarkUnavailableModal from "./MarkUnavailableModal";
import EditUnavailableModal from "./EditUnavailableModal";
import { useMutation } from "@tanstack/react-query";
import {
    createGetRoomVariantByIdQueryOptions,
    createMarkRoomAsUnavailableMutationOptions,
    createUpdateRoomUnavailabilityMutationOptions,
} from "@/queryOptions/roomVariantQueryOptions";
import { toast } from "sonner";
import { queryClient } from "@/config/tanstackQueryConfig";
import type { HttpResponse } from "@/types/api/responseType";

interface RoomInstancesSectionProps {
    roomVariantId: string;
    roomVariant: IRoomVariantDetailResponse;
}

const STATUS_CONFIGS: Record<
    string,
    { icon: typeof Wrench; color: string; bgColor: string; label: string }
> = {
    MAINTENANCE: {
        icon: Wrench,
        color: "text-yellow-700",
        bgColor: "bg-yellow-50 border-yellow-200",
        label: "MAINTENANCE",
    },
    BLOCKED: {
        icon: Ban,
        color: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
        label: "BLOCKED",
    },
};

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

    const handleMarkUnavailable = (data: {
        roomNumber: string;
        status: RoomStatus;
        reason: string;
    }) => {
        markRoomAsUnavailableMutation(
            {
                roomVariantId: roomVariant.id,
                roomNumber: Number(data.roomNumber),
                status: data.status,
                reason: data.reason,
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
        console.log("Restore room:", room.roomNumber);
    };

    const handleEdit = (room: IUnAvailableRoom) => {
        setSelectedRoom(room);
        setIsEditModalOpen(true);
    };

    const handleUpdateRoom = (data: {
        id: string;
        status: RoomStatus;
        reason: string;
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
                    {roomVariant.unAvailableRooms.map((room) => {
                        const config =
                            STATUS_CONFIGS[room.status] ||
                            STATUS_CONFIGS.MAINTENANCE;
                        return (
                            <div
                                key={room.roomNumber}
                                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-900">
                                            • #{roomVariant.roomPrefix}
                                            {room.roomNumber}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                                        {config.label}
                                    </span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {room.reason}
                                    </p>
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(room)}
                                        className="p-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleRestore(room)}
                                        className="px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                        {t(translationKey.text.restore)}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

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
