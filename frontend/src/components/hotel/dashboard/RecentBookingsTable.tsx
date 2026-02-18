import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import Table from "@/components/shared/Table/Table";
import translationKey from "@/utils/i18n/translationKey";
import type { IRecentBooking } from "@/types/api/responses/dashboardResponse";

const t_keys = translationKey.dashboard;
const statusKeys = translationKey.bookingStatus;

function StatusBadge({ status }: { status: string }) {
    const { t } = useTranslation();
    const colorMap: Record<string, string> = {
        CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
        CHECKED_IN: "bg-green-50 text-green-700 border-green-200",
        COMPLETED: "bg-neutral-100 text-neutral-600 border-neutral-200",
    };
    const colors =
        colorMap[status] ||
        "bg-neutral-100 text-neutral-600 border-neutral-200";
    const key = statusKeys[status as keyof typeof statusKeys];

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors}`}
        >
            {key ? t(key) : status}
        </span>
    );
}

interface Props {
    bookings: IRecentBooking[];
}

export default function RecentBookingsTable({ bookings }: Props) {
    const { t } = useTranslation();

    const headers = [
        {
            id: "guestName",
            label: t(t_keys.guestName),
            render: (row: IRecentBooking) => (
                <span className="font-medium text-neutral-900">
                    {row.guestName}
                </span>
            ),
        },
        {
            id: "roomType",
            label: t(t_keys.roomType),
            render: (row: IRecentBooking) => (
                <span className="text-neutral-600">{row.roomVariantName}</span>
            ),
        },
        {
            id: "checkIn",
            label: t(t_keys.checkIn),
            render: (row: IRecentBooking) => (
                <span className="text-neutral-600">
                    {format(new Date(row.checkInDate), "MMM dd, yyyy")}
                </span>
            ),
        },
        {
            id: "checkOut",
            label: t(t_keys.checkOut),
            render: (row: IRecentBooking) => (
                <span className="text-neutral-600">
                    {format(new Date(row.checkOutDate), "MMM dd, yyyy")}
                </span>
            ),
        },
        {
            id: "status",
            label: t(t_keys.status),
            render: (row: IRecentBooking) => (
                <StatusBadge status={row.status} />
            ),
        },
        {
            id: "amount",
            label: t(t_keys.amount),
            render: (row: IRecentBooking) => (
                <span className="font-medium text-neutral-900">
                    ₹{row.totalAmount.toLocaleString()}
                </span>
            ),
        },
    ];

    return <Table headers={headers} data={bookings} />;
}
