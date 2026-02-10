import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Wrench, Ban } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import type {
    IUnAvailableRoom,
    IRoomVariantDetailResponse,
    RoomStatus,
} from "@/types/api/responses/roomVariantDetailResponse";
import MarkUnavailableModal from "./MarkUnavailableModal";

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

    const handleMarkUnavailable = (data: {
        roomNumber: string;
        status: RoomStatus;
        reason: string;
    }) => {
        console.log(data);
        setIsMarkUnavailableOpen(false);
    };

    const handleRestore = (room: IUnAvailableRoom) => {
        console.log("Restore room:", room.roomNumber);
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
                        const StatusIcon = config.icon;
                        return (
                            <div
                                key={room.roomNumber}
                                className={`border rounded-xl p-4 ${config.bgColor}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block mb-1">
                                            #{roomVariant.roomPrefix}
                                            {room.roomNumber}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                    {room.reason}
                                </p>
                                <button
                                    onClick={() => handleRestore(room)}
                                    className="w-full px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    {t(translationKey.text.restore)}
                                </button>
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
