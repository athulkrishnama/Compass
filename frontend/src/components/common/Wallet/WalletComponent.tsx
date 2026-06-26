import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Wallet as WalletIcon,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Loader2,
} from "lucide-react";
import {
    getWalletSummary,
    getWalletTransactions,
    createTopUpPaymentIntent,
    type ITransaction,
} from "@/services/api/walletService";
import { StripeTopUpView } from "./StripeTopUpView";
import translationKey from "@/utils/i18n/translationKey";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";

interface WalletComponentProps {
    role: string;
    title?: string;
    customLabels?: {
        totalCredits?: string;
        totalDebits?: string;
    };
}

export function WalletComponent({
    role,
    title,
    customLabels,
}: WalletComponentProps) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState("");
    const [isToppingUp, setIsToppingUp] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const { data: summary, isLoading: isLoadingSummary } = useQuery({
        queryKey: ["walletSummary", role],
        queryFn: getWalletSummary,
    });

    const { data: transactionsData, isLoading: isLoadingTransactions } =
        useQuery({
            queryKey: ["walletTransactions", role, page, typeFilter],
            queryFn: () =>
                getWalletTransactions({
                    page,
                    limit: 10,
                    type: typeFilter || undefined,
                }),
        });

    if (isLoadingSummary || isLoadingTransactions) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const transactions = transactionsData?.transactions || [];
    const totalPages = transactionsData?.totalPages || 0;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                        <WalletIcon className="w-6 h-6" />
                        {title || t(translationKey.wallet.myWallet)}
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        {t(translationKey.wallet.manageTransactions)}
                    </p>
                </div>
                {role === "USER" && (
                    <button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        Top Up Wallet
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">
                            {t(translationKey.wallet.totalBalance)}
                        </p>
                        <h2 className="text-4xl font-bold">
                            ₹{summary?.balance?.toFixed(2) || "0.00"}
                        </h2>
                    </div>
                    <WalletIcon className="absolute right-4 bottom-4 w-24 h-24 text-white/10" />
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                            {customLabels?.totalCredits || "Total Credits"}
                        </p>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        ₹{summary?.totalCredits?.toFixed(2) || "0.00"}
                    </h3>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                            {customLabels?.totalDebits || "Total Debits"}
                        </p>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        ₹{summary?.totalDebits?.toFixed(2) || "0.00"}
                    </h3>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                        {t(translationKey.wallet.recentTransactions)}
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex-1 sm:flex-none">
                            <Select
                                value={typeFilter || "ALL"}
                                onValueChange={(val) => {
                                    setTypeFilter(val === "ALL" ? "" : val);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[200px] bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 h-10">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-neutral-400" />
                                        <SelectValue placeholder="All Transactions" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Transactions
                                    </SelectItem>
                                    {role === "ADMIN" && (
                                        <>
                                            <SelectItem value="SERVICE_CREDIT">
                                                Service Credit
                                            </SelectItem>
                                            <SelectItem value="COMMISSION">
                                                Commission
                                            </SelectItem>
                                            <SelectItem value="COMMISSION_DEBIT">
                                                Commission Debit
                                            </SelectItem>
                                            <SelectItem value="WALLET_DEBIT">
                                                Wallet Debit
                                            </SelectItem>
                                            <SelectItem value="REFUND">
                                                Refund
                                            </SelectItem>
                                        </>
                                    )}
                                    {role === "USER" && (
                                        <>
                                            <SelectItem value="PAYMENT">
                                                Payment
                                            </SelectItem>
                                            <SelectItem value="REFUND">
                                                Refund
                                            </SelectItem>
                                            <SelectItem value="TOP_UP">
                                                Top Up
                                            </SelectItem>
                                        </>
                                    )}
                                    {(role === "CAB" || role === "HOTEL") && (
                                        <>
                                            <SelectItem value="WALLET_CREDIT">
                                                Wallet Credit
                                            </SelectItem>
                                            <SelectItem value="WALLET_DEBIT">
                                                Wallet Debit
                                            </SelectItem>
                                            <SelectItem value="COMMISSION_DEBIT">
                                                Commission Debit
                                            </SelectItem>
                                            <SelectItem value="REFUND">
                                                Refund
                                            </SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 text-sm">
                                <th className="py-4 px-6 font-medium">Date</th>
                                <th className="py-4 px-6 font-medium">
                                    Description
                                </th>
                                <th className="py-4 px-6 font-medium">Type</th>
                                <th className="py-4 px-6 font-medium">
                                    Payment Method
                                </th>
                                <th className="py-4 px-6 font-medium text-right">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {transactions.length > 0 ? (
                                transactions.map((tx: ITransaction) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    >
                                        <td className="py-4 px-6 text-sm text-neutral-600 dark:text-neutral-300">
                                            {new Date(
                                                tx.createdAt
                                            ).toLocaleDateString()}
                                            <div className="text-xs text-neutral-400">
                                                {new Date(
                                                    tx.createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                                                {tx.description || tx.type}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                ID: {tx.bookingId}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 cursor-help hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                                        {tx.type}
                                                        <Info className="w-3 h-3" />
                                                    </span>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-64 text-sm"
                                                    side="top"
                                                >
                                                    <p className="font-semibold text-neutral-800 mb-1">
                                                        {tx.type}
                                                    </p>
                                                    <p className="text-neutral-500"></p>
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-600 dark:text-neutral-300">
                                            {tx.paymentMethod || "N/A"}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {(() => {
                                                const DEBIT_TYPES = [
                                                    "PAYMENT",
                                                    "WALLET_DEBIT",
                                                    "COMMISSION_DEBIT",
                                                ];
                                                const isCredit =
                                                    !DEBIT_TYPES.includes(
                                                        tx.type
                                                    );

                                                return (
                                                    <span
                                                        className={`text-sm font-bold ${
                                                            isCredit
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }`}
                                                    >
                                                        {isCredit ? "+" : "-"}₹
                                                        {tx.amount?.toFixed(2)}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-neutral-500 dark:text-neutral-400"
                                    >
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-neutral-500">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {isTopUpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-neutral-100 dark:border-neutral-700">
                        {clientSecret ? (
                            <StripeTopUpView
                                clientSecret={clientSecret}
                                amount={Number(topUpAmount)}
                                onSuccess={() => {
                                    setIsTopUpModalOpen(false);
                                    setTopUpAmount("");
                                    setClientSecret(null);
                                    window.location.reload();
                                }}
                                onBack={() => setClientSecret(null)}
                            />
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                    Top Up Wallet
                                </h3>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={topUpAmount}
                                        onChange={(e) =>
                                            setTopUpAmount(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        placeholder="Enter amount to top up"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            setIsTopUpModalOpen(false);
                                            setTopUpAmount("");
                                        }}
                                        disabled={isToppingUp}
                                        className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-medium transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                !topUpAmount ||
                                                isNaN(Number(topUpAmount)) ||
                                                Number(topUpAmount) <= 0
                                            )
                                                return;
                                            setIsToppingUp(true);
                                            try {
                                                const { clientSecret } =
                                                    await createTopUpPaymentIntent(
                                                        Number(topUpAmount)
                                                    );
                                                setClientSecret(clientSecret);
                                            } catch (error) {
                                                console.error(
                                                    "Top-up failed",
                                                    error
                                                );
                                            } finally {
                                                setIsToppingUp(false);
                                            }
                                        }}
                                        disabled={
                                            isToppingUp ||
                                            !topUpAmount ||
                                            Number(topUpAmount) <= 0
                                        }
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isToppingUp && (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        )}
                                        Proceed to Pay
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
