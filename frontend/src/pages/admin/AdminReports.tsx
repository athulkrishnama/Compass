import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import {
    getAdminHotelReport,
    downloadAdminHotelReportPdf,
    getAdminCabReport,
    downloadAdminCabReportPdf,
} from "@/services/api/adminApiService";
import { ReportFilters } from "@/components/common/reports/ReportFilters";
import { ReportTable } from "@/components/common/reports/ReportTable";
import type { ColumnDefinition } from "@/components/common/reports/ReportTable";
import { useReportFilters } from "@/hooks/useReportFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
    createGetAdminHotelReportQueryOptions,
    createGetAdminCabReportQueryOptions,
} from "@/queryOptions/adminQueryOptions";

interface AdminHotelReportItem {
    bookingId: string;
    hotelName: string;
    roomVariantName: string;
    guestName: string;
    amount: number;
    bookingStatus: string;
}

interface AdminCabReportItem {
    bookingId: string;
    driverName?: string;
    username: string;
    amount: number;
    status: string;
}

export default function AdminReportsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("hotel");

    const [isHotelGeneratingPdf, setIsHotelGeneratingPdf] = useState(false);
    const [isCabGeneratingPdf, setIsCabGeneratingPdf] = useState(false);

    // Separate filter hooks for independent state
    const hotelFilters = useReportFilters();
    const cabFilters = useReportFilters();

    const hotelParamsObj = Object.fromEntries(
        hotelFilters.buildQueryParams().entries()
    ) as Parameters<typeof getAdminHotelReport>[0];

    const {
        data: hotelResponse,
        isLoading: isHotelLoading,
        error: hotelError,
    } = useQuery({
        ...createGetAdminHotelReportQueryOptions(hotelParamsObj),
        enabled: activeTab === "hotel",
    });

    const cabParamsObj = Object.fromEntries(
        cabFilters.buildQueryParams().entries()
    ) as Parameters<typeof getAdminCabReport>[0];

    const {
        data: cabResponse,
        isLoading: isCabLoading,
        error: cabError,
    } = useQuery({
        ...createGetAdminCabReportQueryOptions(cabParamsObj),
        enabled: activeTab === "cab",
    });

    useEffect(() => {
        if (hotelError) {
            toast.error(
                hotelError instanceof Error
                    ? hotelError.message
                    : "Failed to fetch hotel report"
            );
        }
        if (cabError) {
            toast.error(
                cabError instanceof Error
                    ? cabError.message
                    : "Failed to fetch cab report"
            );
        }
    }, [hotelError, cabError]);

    const hotelData = hotelResponse?.items || [];
    const hotelTotalPages = hotelResponse?.totalPages || 1;

    const cabData = cabResponse?.items || [];
    const cabTotalPages = cabResponse?.totalPages || 1;

    const handleGenerateHotelPdf = async () => {
        setIsHotelGeneratingPdf(true);
        try {
            const paramsObj = Object.fromEntries(
                hotelFilters.buildQueryParams().entries()
            );
            delete paramsObj.pageNo;
            delete paramsObj.limit;

            await downloadAdminHotelReportPdf(
                paramsObj as Parameters<typeof downloadAdminHotelReportPdf>[0]
            );
            toast.success("Hotel report PDF downloaded");
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to generate PDF"
            );
        } finally {
            setIsHotelGeneratingPdf(false);
        }
    };

    const handleGenerateCabPdf = async () => {
        setIsCabGeneratingPdf(true);
        try {
            const paramsObj = Object.fromEntries(
                cabFilters.buildQueryParams().entries()
            );
            delete paramsObj.pageNo;
            delete paramsObj.limit;

            await downloadAdminCabReportPdf(
                paramsObj as Parameters<typeof downloadAdminCabReportPdf>[0]
            );
            toast.success("Cab report PDF downloaded");
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to generate PDF"
            );
        } finally {
            setIsCabGeneratingPdf(false);
        }
    };

    const statusOptions = [
        { value: "completed", label: t(translationKey.reports.completed) },
        { value: "cancelled", label: t(translationKey.reports.cancelled) },
    ];

    const hotelColumns: ColumnDefinition<AdminHotelReportItem>[] = [
        {
            id: "bookingId",
            label: t(translationKey.reports.bookingId),
            render: (row) => (
                <span className="font-medium">{row.bookingId}</span>
            ),
        },
        {
            id: "hotelName",
            label: t(translationKey.reports.hotelName),
            render: (row) => row.hotelName,
        },
        {
            id: "roomVariantName",
            label: t(translationKey.reports.roomName),
            render: (row) => row.roomVariantName,
        },
        {
            id: "guestName",
            label: t(translationKey.reports.guestName),
            render: (row) => row.guestName,
        },
        {
            id: "amount",
            label: t(translationKey.reports.amount),
            render: (row) => `₹${row.amount.toFixed(2)}`,
        },
        {
            id: "bookingStatus",
            label: t(translationKey.reports.status),
            render: (row) => {
                const statusStr = row.bookingStatus?.toLowerCase() || "";
                return (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
          ${
              statusStr === "completed" || statusStr === "checked_out"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : statusStr === "cancelled"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
                    >
                        {row.bookingStatus?.replace(/_/g, " ")}
                    </span>
                );
            },
        },
    ];

    const cabColumns: ColumnDefinition<AdminCabReportItem>[] = [
        {
            id: "bookingId",
            label: t(translationKey.reports.bookingId),
            render: (row) => (
                <span className="font-medium">{row.bookingId}</span>
            ),
        },
        {
            id: "driverName",
            label: "Driver Name",
            render: (row) => row.driverName || "Unknown",
        },
        {
            id: "username",
            label: t(translationKey.reports.userName),
            render: (row) => row.username,
        },
        {
            id: "amount",
            label: t(translationKey.reports.amount),
            render: (row) => `₹${row.amount.toFixed(2)}`,
        },
        {
            id: "status",
            label: t(translationKey.reports.status),
            render: (row) => {
                const statusStr = row.status?.toLowerCase() || "";
                return (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
          ${
              statusStr === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : statusStr === "cancelled"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
                    >
                        {row.status?.replace(/_/g, " ")}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {t(translationKey.reports.title)}
                </h1>
                <p className="text-zinc-500 mt-1">
                    View platform-wide booking and ride reports
                </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="mb-6 bg-zinc-100 dark:bg-zinc-800">
                    <TabsTrigger
                        value="hotel"
                        className="px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                    >
                        {t(translationKey.reports.hotelReport)}
                    </TabsTrigger>
                    <TabsTrigger
                        value="cab"
                        className="px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900"
                    >
                        {t(translationKey.reports.cabReport)}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hotel" className="m-0">
                    <ReportFilters
                        onFilterChange={hotelFilters.handleFilterChange}
                        onGeneratePdf={handleGenerateHotelPdf}
                        isGeneratingPdf={isHotelGeneratingPdf}
                        statusOptions={statusOptions}
                    />
                    <ReportTable
                        data={hotelData}
                        columns={hotelColumns}
                        isLoading={isHotelLoading}
                        currentPage={hotelFilters.page}
                        totalPages={hotelTotalPages}
                        onPageChange={hotelFilters.setPage}
                        startIndex={
                            (hotelFilters.page - 1) * hotelFilters.limit + 1
                        }
                    />
                </TabsContent>

                <TabsContent value="cab" className="m-0">
                    <ReportFilters
                        onFilterChange={cabFilters.handleFilterChange}
                        onGeneratePdf={handleGenerateCabPdf}
                        isGeneratingPdf={isCabGeneratingPdf}
                        statusOptions={statusOptions}
                    />
                    <ReportTable
                        data={cabData}
                        columns={cabColumns}
                        isLoading={isCabLoading}
                        currentPage={cabFilters.page}
                        totalPages={cabTotalPages}
                        onPageChange={cabFilters.setPage}
                        startIndex={
                            (cabFilters.page - 1) * cabFilters.limit + 1
                        }
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
