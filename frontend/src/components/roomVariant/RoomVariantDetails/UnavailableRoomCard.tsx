import { useTranslation } from "react-i18next";
import { Pencil, Wrench, Ban } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import type { IUnAvailableRoom } from "@/types/api/responses/roomVariantDetailResponse";
import { format } from "date-fns";
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

interface UnavailableRoomCardProps {
    room: IUnAvailableRoom;
    roomPrefix: string;
    onEdit: (room: IUnAvailableRoom) => void;
    onRestore: (room: IUnAvailableRoom) => void;
}

export default function UnavailableRoomCard({
    room,
    roomPrefix,
    onEdit,
    onRestore,
}: UnavailableRoomCardProps) {
    const { t } = useTranslation();
    const config = STATUS_CONFIGS[room.status] || STATUS_CONFIGS.MAINTENANCE;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        • #{roomPrefix}
                        {room.roomNumber}
                    </span>
                </div>
                <span className="px-3 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 uppercase">
                    {config.label}
                </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                    {room.reason}
                </p>
                {(room.startDate || room.endDate) && (
                    <div className="text-xs text-gray-500 font-medium border-t border-gray-200 pt-2 flex items-center justify-between">
                        <span>{formatDate(room.startDate)}</span>
                        <span>-</span>
                        <span>{formatDate(room.endDate)}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={() => onEdit(room)}
                    className="p-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRestore(room)}
                    className="px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                    {t(translationKey.text.restore)}
                </button>
            </div>
        </div>
    );
}
