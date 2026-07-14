import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import {
    getHotelReport,
    downloadHotelReportPdf,
} from "@/services/api/bookingService";
import { ReportFilters } from "@/components/common/reports/ReportFilters";
import { ReportTable } from "@/components/common/reports/ReportTable";
import type { ColumnDefinition } from "@/components/common/reports/ReportTable";
import { useReportFilters } from "@/hooks/useReportFilters";
import { useQuery } from "@tanstack/react-query";
import { createGetHotelReportQueryOptions } from "@/queryOptions/bookingQueryOptions";

interface HotelBookingReportItem {
    bookingId: string;
    guestName: string;
    roomVariantName: string;
    amount: number;
    bookingStatus: string;
}

export default function HotelReportPage() {
    const { hotelId } = useParams({ strict: false }) as { hotelId: string };
    const { t } = useTranslation();
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const { handleFilterChange, page, setPage, limit, buildQueryParams } =
        useReportFilters();

    const paramsObj = Object.fromEntries(
        buildQueryParams().entries()
    ) as Parameters<typeof getHotelReport>[1];

    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        ...createGetHotelReportQueryOptions(hotelId, paramsObj),
        enabled: !!hotelId,
    });

    useEffect(() => {
        if (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch report"
            );
        }
    }, [error]);

    const data = response?.items || [];
    const totalPages = response?.totalPages || 1;

    const handleGeneratePdf = async () => {
        if (!hotelId) return;

        setIsGeneratingPdf(true);
        try {
            const paramsObj = Object.fromEntries(buildQueryParams().entries());
            delete paramsObj.pageNo;
            delete paramsObj.limit;

            await downloadHotelReportPdf(
                hotelId,
                paramsObj as Parameters<typeof downloadHotelReportPdf>[1]
            );
            toast.success("PDF downloaded successfully");
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to generate PDF"
            );
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const statusOptions = [
        { value: "completed", label: t(translationKey.reports.completed) },
        { value: "cancelled", label: t(translationKey.reports.cancelled) },
        { value: "upcoming", label: t(translationKey.reports.upcoming) },
    ];

    const columns: ColumnDefinition<HotelBookingReportItem>[] = [
        {
            id: "bookingId",
            label: t(translationKey.reports.bookingId),
            render: (row) => (
                <span className="font-medium">{row.bookingId}</span>
            ),
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
            label: t(translationKey.reports.amountAfterCommission),
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

    const startIndex = (page - 1) * limit + 1;

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {t(translationKey.reports.hotelReport)}
                </h1>
                <p className="text-zinc-500 mt-1">
                    View and analyze booking data for your hotel
                </p>
            </div>

            <ReportFilters
                onFilterChange={(newFilters) => handleFilterChange(newFilters)}
                onGeneratePdf={handleGeneratePdf}
                isGeneratingPdf={isGeneratingPdf}
                statusOptions={statusOptions}
            />

            <ReportTable
                data={data}
                columns={columns}
                isLoading={isLoading}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                startIndex={startIndex}
            />
        </div>
    );
}
