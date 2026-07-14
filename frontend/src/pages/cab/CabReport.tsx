import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import {
    getDriverReport,
    downloadDriverReportPdf,
} from "@/services/api/rideApiService";
import { ReportFilters } from "@/components/common/reports/ReportFilters";
import { ReportTable } from "@/components/common/reports/ReportTable";
import type { ColumnDefinition } from "@/components/common/reports/ReportTable";
import { useReportFilters } from "@/hooks/useReportFilters";

interface DriverRideReportItem {
    bookingId: string;
    username: string;
    amount: number;
    status: string;
}

export default function CabReportPage() {
    const { t } = useTranslation();
    const [data, setData] = useState<DriverRideReportItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const { handleFilterChange, page, setPage, limit, buildQueryParams } =
        useReportFilters();

    const fetchReport = useCallback(async () => {
        setIsLoading(true);
        try {
            const paramsObj = Object.fromEntries(buildQueryParams().entries());
            const response = await getDriverReport(
                paramsObj as Parameters<typeof getDriverReport>[0]
            );

            setData(response.items || []);
            setTotalPages(response.totalPages || 1);
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch report"
            );
        } finally {
            setIsLoading(false);
        }
    }, [buildQueryParams]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            const paramsObj = Object.fromEntries(buildQueryParams().entries());
            // Remove pagination params for PDF
            delete paramsObj.pageNo;
            delete paramsObj.limit;

            await downloadDriverReportPdf(
                paramsObj as Parameters<typeof downloadDriverReportPdf>[0]
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
    ];

    const columns: ColumnDefinition<DriverRideReportItem>[] = [
        {
            id: "bookingId",
            label: t(translationKey.reports.bookingId),
            render: (row) => (
                <span className="font-medium">{row.bookingId}</span>
            ),
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

    const startIndex = (page - 1) * limit + 1;

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {t(translationKey.reports.cabReport)}
                </h1>
                <p className="text-zinc-500 mt-1">
                    View and analyze ride data for your cab
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
