import { useQuery } from "@tanstack/react-query";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { getWallet, getTransactions } from "@/services/api/bookingService";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowDownRight, Building2, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination/Pagination";
import { Separator } from "@radix-ui/react-select";

interface ITransaction {
    id: string;
    bookingId: string;
    amount: number;
    commissionRate?: number;
    commissionAmount?: number;
    providerAmount?: number;
    type: string;
    serviceType: string;
    createdAt: string;
    hotelName?: string;
}

interface ITransactionData {
    transactions: ITransaction[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

interface IWalletData {
    balance: number;
}

interface IHotel {
    id: string;
    name: string;
    coverImage: string;
    city: string;
    country: string;
}

function WalletCard({ t }: { t: (key: string) => string }) {
    const { data: walletData, isLoading } = useQuery<IWalletData>({
        queryKey: ["wallet"],
        queryFn: getWallet,
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card className="border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-neutral-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                            {t(translationKeys.transactions.walletBalance)}
                        </p>
                    </div>
                    <div className="text-right">
                        {isLoading ? (
                            <Skeleton className="h-6 w-24 ml-auto" />
                        ) : (
                            <p className="text-lg font-bold text-neutral-900 tabular-nums">
                                ₹
                                {(walletData?.balance ?? 0).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function TransactionRow({
    tx,
    index,
    t,
}: {
    tx: ITransaction;
    index: number;
    t: (key: string) => string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className="flex items-center gap-3 py-3"
        >
            <div className="flex-shrink-0 w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-neutral-700" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                    {t(translationKeys.transactions.bookingId)}:{" "}
                    <span className="font-mono text-neutral-500 text-xs">
                        {tx.bookingId.slice(-8)}
                    </span>
                </p>
                {tx.hotelName && (
                    <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                        {tx.hotelName}
                    </p>
                )}
                <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-neutral-900 tabular-nums">
                    {tx.type === "PAYMENT" ? (
                        <span className="text-neutral-500">
                            ₹
                            {tx.amount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                    ) : (
                        <>
                            +₹
                            {(tx.providerAmount ?? 0).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                            })}
                        </>
                    )}
                </p>
                {tx.type === "PAYMENT" ? (
                    <p className="text-[11px] text-orange-600 font-medium">
                        {t(translationKeys.transactions.creditedToAdmin)}
                    </p>
                ) : (
                    tx.commissionAmount !== undefined && (
                        <p className="text-[11px] text-neutral-400">
                            {t(translationKeys.transactions.commission)}: ₹
                            {tx.commissionAmount.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                            })}{" "}
                            ({tx.commissionRate}%)
                        </p>
                    )
                )}
            </div>
        </motion.div>
    );
}

function TransactionsBlock({ t }: { t: (key: string) => string }) {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<ITransactionData>({
        queryKey: ["transactions", page],
        queryFn: () => getTransactions(page),
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card className="border-neutral-200 bg-white shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Receipt className="w-4 h-4 text-neutral-500" />
                        {t(translationKeys.transactions.transactionHistory)}
                        {data && (
                            <Badge
                                variant="secondary"
                                className="ml-auto text-xs font-normal"
                            >
                                {data.totalCount}{" "}
                                {data.totalCount === 1
                                    ? "transaction"
                                    : "transactions"}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton className="w-9 h-9 rounded-lg" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-3.5 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    ) : !data?.transactions?.length ? (
                        <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
                            <Wallet className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-sm">
                                {t(translationKeys.transactions.noTransactions)}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-neutral-100">
                                <AnimatePresence>
                                    {data.transactions.map((tx, idx) => (
                                        <TransactionRow
                                            key={tx.id}
                                            tx={tx}
                                            index={idx}
                                            t={t}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

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
    );
}

export default function HotelTransactions() {
    const { data: hotelsData, isLoading: hotelsLoading } = useQuery(
        createGetHotelsByUserIdQueryOptions()
    );
    const { t } = useTranslation();

    const hotels: IHotel[] = hotelsData?.data?.hotels || [];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900">
                            {t(translationKeys.transactions.title)}
                        </h1>
                        <p className="text-sm text-neutral-500">
                            {t(translationKeys.transactions.walletBalance)} &{" "}
                            {t(translationKeys.transactions.transactionHistory)}
                        </p>
                    </div>
                </div>

                {hotelsLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <Card key={i} className="border-neutral-200">
                                <CardContent className="flex items-center gap-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-28" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : hotels.length === 0 ? (
                    <Card className="border-neutral-200 bg-white">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-neutral-400">
                            <Building2 className="w-10 h-10 mb-3 opacity-40" />
                            <p className="text-sm font-medium">
                                {t(
                                    translationKeys.hotelBookingListing
                                        .noHotelsFound
                                )}
                            </p>
                            <p className="text-xs mt-1 text-neutral-400">
                                {t(
                                    translationKeys.hotelBookingListing
                                        .noHotelsDescription
                                )}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                                {t(translationKeys.transactions.walletBalance)}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <WalletCard key="wallet" t={t} />
                            </div>
                        </section>

                        <Separator className="bg-neutral-200" />

                        <section>
                            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                                {t(
                                    translationKeys.transactions
                                        .transactionHistory
                                )}
                            </h2>
                            <div className="space-y-4">
                                <TransactionsBlock key="transactions" t={t} />
                            </div>
                        </section>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
