import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import Table from "@/components/shared/Table/Table";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import type { IHotelDashboardSummary } from "@/types/api/responses/dashboardResponse";

const t_keys = translationKey.dashboard;

interface Props {
    hotels: IHotelDashboardSummary[];
}

export default function PropertyTable({ hotels }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const headers = [
        {
            id: "name",
            label: t(t_keys.hotelName),
            render: (row: IHotelDashboardSummary) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.coverImage}
                        alt={row.name}
                        className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-neutral-900 text-sm">
                        {row.name}
                    </span>
                </div>
            ),
        },
        {
            id: "city",
            label: t(t_keys.city),
            render: (row: IHotelDashboardSummary) => (
                <span className="text-sm text-neutral-600">{row.city}</span>
            ),
        },
        {
            id: "rooms",
            label: t(t_keys.rooms),
            render: (row: IHotelDashboardSummary) => (
                <span className="text-sm text-neutral-600">
                    {row.occupiedRooms}/{row.totalRooms}
                </span>
            ),
        },
        {
            id: "occupancy",
            label: t(t_keys.occupancy),
            render: (row: IHotelDashboardSummary) => (
                <span
                    className={`text-sm font-medium ${row.occupancyRate >= 70 ? "text-green-600" : row.occupancyRate >= 40 ? "text-amber-600" : "text-neutral-500"}`}
                >
                    {row.occupancyRate}%
                </span>
            ),
        },
        {
            id: "actions",
            label: t(t_keys.actions),
            render: (row: IHotelDashboardSummary) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        navigate({
                            to: "/hotel/dashboard/$hotelId",
                            params: { hotelId: row.id },
                        })
                    }
                    className="hover:bg-neutral-100 hover:text-black border-neutral-200 text-neutral-600"
                >
                    {t(translationKey.button.viewDetails)}
                </Button>
            ),
        },
    ];

    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:block">
                <Table headers={headers} data={hotels} />
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {hotels.map((row) => (
                    <div
                        key={row.id}
                        className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                            <img
                                src={row.coverImage}
                                alt={row.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-neutral-900 text-sm">
                                    {row.name}
                                </h3>
                                <p className="text-xs text-neutral-500">
                                    {row.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">
                                {t(t_keys.rooms)}:
                            </span>
                            <span className="font-medium text-neutral-900">
                                {row.occupiedRooms}/{row.totalRooms}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">
                                {t(t_keys.occupancy)}:
                            </span>
                            <span
                                className={`font-medium ${
                                    row.occupancyRate >= 70
                                        ? "text-green-600"
                                        : row.occupancyRate >= 40
                                          ? "text-amber-600"
                                          : "text-neutral-500"
                                }`}
                            >
                                {row.occupancyRate}%
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                navigate({
                                    to: "/hotel/dashboard/$hotelId",
                                    params: { hotelId: row.id },
                                })
                            }
                            className="w-full mt-2 hover:bg-neutral-100 hover:text-black border-neutral-200 text-neutral-600"
                        >
                            {t(translationKey.button.viewDetails)}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
