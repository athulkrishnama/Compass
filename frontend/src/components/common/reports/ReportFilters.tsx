import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface ReportFilterValues {
    search: string;
    status: string;
    timeRange: string;
    customDateFrom?: Date;
    customDateTo?: Date;
}

interface ReportFiltersProps {
    onFilterChange: (filters: ReportFilterValues) => void;
    onGeneratePdf: () => void;
    isGeneratingPdf: boolean;
    statusOptions: { value: string; label: string }[];
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
    onFilterChange,
    onGeneratePdf,
    isGeneratingPdf,
    statusOptions,
}) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ReportFilterValues>({
        search: "",
        status: "all",
        timeRange: "all",
    });

    const handleFilterChange = (
        key: keyof ReportFilterValues,
        value: string | Date | undefined
    ) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    const handleApply = () => {
        onFilterChange(filters);
    };

    const handleClear = () => {
        const defaultFilters = { search: "", status: "all", timeRange: "all" };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                        placeholder={t(translationKey.reports.searchByName)}
                        value={filters.search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFilterChange("search", e.target.value)
                        }
                        className="pl-9 h-10 w-full"
                    />
                </div>

                <div className="w-full md:w-48">
                    <Select
                        value={filters.status}
                        onValueChange={(val: string) =>
                            handleFilterChange("status", val)
                        }
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue
                                placeholder={t(
                                    translationKey.reports.statusFilter
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t(translationKey.reports.all)}
                            </SelectItem>
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-48">
                    <Select
                        value={filters.timeRange}
                        onValueChange={(val: string) =>
                            handleFilterChange("timeRange", val)
                        }
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue
                                placeholder={t(
                                    translationKey.reports.dateRange
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t(translationKey.reports.all)}
                            </SelectItem>
                            <SelectItem value="today">
                                {t(translationKey.reports.today)}
                            </SelectItem>
                            <SelectItem value="week">
                                {t(translationKey.reports.thisWeek)}
                            </SelectItem>
                            <SelectItem value="month">
                                {t(translationKey.reports.thisMonth)}
                            </SelectItem>
                            <SelectItem value="year">
                                {t(translationKey.reports.thisYear)}
                            </SelectItem>
                            <SelectItem value="custom">
                                {t(translationKey.reports.customDate)}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filters.timeRange === "custom" && (
                <div className="flex flex-col md:flex-row gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-500 w-20">
                            {t(translationKey.reports.startDate)}:
                        </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 justify-start text-left font-normal w-[200px]"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.customDateFrom ? (
                                        format(filters.customDateFrom, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={filters.customDateFrom}
                                    onSelect={(date: Date | undefined) =>
                                        handleFilterChange(
                                            "customDateFrom",
                                            date
                                        )
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-500 w-20">
                            {t(translationKey.reports.endDate)}:
                        </span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 justify-start text-left font-normal w-[200px]"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.customDateTo ? (
                                        format(filters.customDateTo, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={filters.customDateTo}
                                    onSelect={(date: Date | undefined) =>
                                        handleFilterChange("customDateTo", date)
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-2 gap-4 md:gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        onClick={handleApply}
                        className="flex-1 md:flex-none h-9 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t(translationKey.reports.applyFilters)}
                    </Button>
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="flex-1 md:flex-none h-9 px-4 rounded-lg text-sm font-medium"
                    >
                        {t(translationKey.reports.clearFilters)}
                    </Button>
                </div>

                <Button
                    onClick={onGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="h-9 px-4 w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white shadow-sm rounded-lg flex items-center justify-center md:justify-start gap-2 transition-all hover:-translate-y-0.5"
                >
                    <Download className="w-4 h-4" />
                    {isGeneratingPdf
                        ? "Generating..."
                        : t(translationKey.reports.generatePdf)}
                </Button>
            </div>
        </div>
    );
};
