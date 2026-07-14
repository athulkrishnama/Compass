import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/shared/Table/Table";
import Pagination from "@/components/shared/Pagination/Pagination";
import translationKey from "@/utils/i18n/translationKey";

export interface ColumnDefinition<T> {
    id: string;
    label: string;
    render: (row: T) => React.ReactNode;
}

interface ReportTableProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startIndex: number;
}

export function ReportTable<T>({
    data,
    columns,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    startIndex,
}: ReportTableProps<T>) {
    const { t } = useTranslation();

    const indexColumn: ColumnDefinition<T> = {
        id: "index",
        label: t(translationKey.reports.index),
        render: (_row: T) => {
            return (
                <span className="font-medium text-zinc-500">
                    {(_row as T & { _index: number })._index}
                </span>
            );
        },
    };

    const tableHeaders = [indexColumn, ...columns];

    const dataWithIndex = data.map((row, idx) => ({
        ...row,
        _index: startIndex + idx,
    }));

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto min-h-[300px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <Table
                        headers={tableHeaders}
                        data={dataWithIndex}
                        containerClassName="border-0 shadow-none"
                    />
                )}
            </div>

            {totalPages > 1 && !isLoading && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setPage={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
