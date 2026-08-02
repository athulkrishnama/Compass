import React from "react";
import { useTranslation } from "react-i18next";
import Loading from "@/components/shared/loading/Loading";
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
                        <Loading />
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <Table
                                headers={tableHeaders}
                                data={dataWithIndex}
                                containerClassName="border-0 shadow-none"
                            />
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50">
                            {dataWithIndex.length === 0 ? (
                                <div className="text-center py-8 text-sm text-zinc-500">
                                    {t(translationKey.reports.noDataFound)}
                                </div>
                            ) : (
                                dataWithIndex.map((row, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-3 overflow-hidden"
                                    >
                                        {tableHeaders.map((col, cIdx) => (
                                            <div
                                                key={cIdx}
                                                className={`flex justify-between items-start text-sm ${
                                                    cIdx !==
                                                    tableHeaders.length - 1
                                                        ? "border-b border-zinc-100 dark:border-zinc-800 pb-3"
                                                        : ""
                                                }`}
                                            >
                                                <span className="text-zinc-500 font-medium whitespace-nowrap mr-4">
                                                    {col.label}
                                                </span>
                                                <div className="text-right flex-1 break-words overflow-hidden text-zinc-900 dark:text-zinc-100 flex justify-end">
                                                    {col.render(row)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
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
