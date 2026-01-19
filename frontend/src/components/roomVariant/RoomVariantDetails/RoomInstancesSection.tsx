import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { IRoomInstance } from "@/types/api/responses/roomVariantDetailResponse";
import AddRoomModal from "@/components/room/AddRoomModal";
import EditRoomModal from "@/components/room/EditRoomModal";
import Table from "@/components/shared/Table/Table";
import { ROOM_STATUS_WITH_ICON_AND_TRANSLATION } from "@/constants/roomConstants/roomStatusWithIconAndTranslation";
import { useState } from "react";

interface RoomInstancesSectionProps {
    hotelId: string;
    roomVariantId: string;
    rooms: IRoomInstance[];
}

export default function RoomInstancesSection({
    hotelId,
    roomVariantId,
    rooms,
}: RoomInstancesSectionProps) {
    const { t } = useTranslation();
    const [editingRoom, setEditingRoom] = useState<IRoomInstance | null>(null);

    const handleEdit = (room: IRoomInstance) => {
        setEditingRoom(room);
    };

    const closeEditModal = () => {
        setEditingRoom(null);
    };

    const getStatusBadge = (status: string) => {
        const config = ROOM_STATUS_WITH_ICON_AND_TRANSLATION.find(
            (s) => s.value === status
        );

        if (!config) return null;

        const colorClasses: Record<string, string> = {
            ACTIVE: "bg-green-50 text-green-700 border border-green-200",
            INACTIVE: "bg-gray-50 text-gray-700 border border-gray-200",
            MAINTENANCE:
                "bg-yellow-50 text-yellow-700 border border-yellow-200",
        };

        const className = colorClasses[status] || colorClasses.INACTIVE;

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${className}`}
            >
                <config.icon className="w-3 h-3" />
                {t(config.labelKey)}
            </span>
        );
    };

    const getFloorLabel = (floor: number) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = floor % 100;
        const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
        return `${floor}${suffix} Floor`;
    };

    const headers = [
        {
            id: "roomCode",
            label: t(translationKey.tableHeaders.roomCode),
            render: (room: IRoomInstance) => (
                <span className="text-sm font-semibold text-gray-900">
                    {room.roomCode}
                </span>
            ),
        },
        {
            id: "floor",
            label: t(translationKey.tableHeaders.floorNumber),
            render: (room: IRoomInstance) => (
                <span className="text-sm text-gray-600">
                    {getFloorLabel(room.floor)}
                </span>
            ),
        },
        {
            id: "status",
            label: t(translationKey.tableHeaders.status),
            render: (room: IRoomInstance) => getStatusBadge(room.status),
        },
        {
            id: "actions",
            label: t(translationKey.tableHeaders.actions),
            render: (room: IRoomInstance) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={t(translationKey.button.edit)}
                        onClick={() => handleEdit(room)}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        {t(translationKey.text.roomInstances)}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {rooms.length} {t(translationKey.text.total)}
                    </span>
                </div>
                <AddRoomModal hotelId={hotelId} roomVariantId={roomVariantId} />
            </div>
            <Table
                headers={headers}
                data={rooms}
                containerClassName="border-none shadow-none rounded-none"
            />

            {editingRoom && (
                <EditRoomModal
                    isOpen={!!editingRoom}
                    onClose={closeEditModal}
                    room={editingRoom}
                    roomVariantId={roomVariantId}
                />
            )}
        </div>
    );
}
