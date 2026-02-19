import { useQuery } from "@tanstack/react-query";
import { getAdminTransactions } from "@/services/api/adminApiService";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination/Pagination";

interface IAdminTransaction {
    id: string;
    bookingId: string;
    hotelName?: string;
    serviceType: string;
    amount: number;
    commissionRate?: number;
    commissionAmount?: number;
    providerAmount?: number;
    type: string;
    createdAt: string;
}

interface IAdminTransactionData {
    transactions: IAdminTransaction[];
    totalCommission?: number;
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

export default function AdminTransactions() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<IAdminTransactionData>({
        queryKey: ["adminTransactions", page],
        queryFn: () => getAdminTransactions(page),
    });

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900">
                            {t(translationKeys.transactions.adminTitle)}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            {t(translationKeys.transactions.totalCommission)}
                        </p>
                    </div>
                </div>

                {/* Total Commission Card */}
                <Card className="border-neutral-200 bg-neutral-950 text-white mb-8 shadow-lg">
                    <CardContent className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 font-medium mb-0.5">
                                {t(
                                    translationKeys.transactions.totalCommission
                                )}
                            </p>
                            {isLoading ? (
                                <div className="h-8 w-36 bg-white/10 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold tracking-tight tabular-nums">
                                    ₹
                                    {(
                                        data?.totalCommission ?? 0
                                    ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            )}
                        </div>
                        {data && (
                            <Badge
                                variant="secondary"
                                className="ml-auto bg-white/10 text-white border-white/20 text-xs"
                            >
                                {data.totalCount}{" "}
                                {data.totalCount === 1
                                    ? "transaction"
                                    : "transactions"}
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="border-neutral-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-neutral-500" />
                            {t(translationKeys.transactions.transactionHistory)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="w-9 h-9 rounded-lg" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-3.5 w-40" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : !data?.transactions?.length ? (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                <Wallet className="w-8 h-8 mb-2 opacity-40" />
                                <p className="text-sm">
                                    {t(
                                        translationKeys.transactions
                                            .noTransactions
                                    )}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-neutral-100">
                                    <AnimatePresence>
                                        {data.transactions.map(
                                            (
                                                tx: IAdminTransaction,
                                                idx: number
                                            ) => (
                                                // Replace the existing rendering block for the transaction amount
                                                <motion.div
                                                    key={tx.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: idx * 0.03,
                                                        duration: 0.2,
                                                    }}
                                                    className="flex items-center gap-3 py-3"
                                                >
                                                    <div className="flex-shrink-0 w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                                                        <ArrowUpRight className="w-4 h-4 text-neutral-700" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-900">
                                                            {tx.hotelName ||
                                                                t(
                                                                    translationKeys
                                                                        .transactions
                                                                        .hotelName
                                                                )}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-xs text-neutral-400 font-mono">
                                                                {tx.bookingId.slice(
                                                                    -8
                                                                )}
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] px-1.5 py-0 h-4 text-neutral-500 border-neutral-200"
                                                            >
                                                                {tx.serviceType}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-neutral-400 mt-0.5">
                                                            {new Date(
                                                                tx.createdAt
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        {tx.type ===
                                                        "PAYMENT" ? (
                                                            <>
                                                                <p className="text-sm font-semibold text-green-600 tabular-nums">
                                                                    +₹
                                                                    {tx.amount.toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-[11px] text-neutral-400">
                                                                    {t(
                                                                        translationKeys
                                                                            .transactions
                                                                            .paymentReceived
                                                                    )}
                                                                </p>
                                                            </>
                                                        ) : tx.type ===
                                                          "SERVICE_CREDIT" ? (
                                                            <>
                                                                <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                                                                    +₹
                                                                    {(
                                                                        tx.commissionAmount ??
                                                                        0
                                                                    ).toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-[11px] text-neutral-400">
                                                                    {t(
                                                                        translationKeys
                                                                            .transactions
                                                                            .hotelCredit
                                                                    )}
                                                                    : ₹
                                                                    {(
                                                                        tx.providerAmount ??
                                                                        0
                                                                    ).toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                                                                    +₹
                                                                    {(
                                                                        tx.commissionAmount ??
                                                                        0
                                                                    ).toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-[11px] text-neutral-400">
                                                                    {t(
                                                                        translationKeys
                                                                            .transactions
                                                                            .amount
                                                                    )}
                                                                    : ₹
                                                                    {tx.amount.toLocaleString(
                                                                        "en-IN",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination */}
                                {data.totalPages > 1 && (
                                    <Pagination
                                        currentPage={page}
                                        totalPages={data.totalPages}
                                        setPage={setPage}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
