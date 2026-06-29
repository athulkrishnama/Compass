import { useTranslation } from "react-i18next";
import { Filter, Info } from "lucide-react";
import { type ITransaction } from "@/services/api/walletService";
import translationKey from "@/utils/i18n/translationKey";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface WalletTransactionsProps {
    transactions: ITransaction[];
    role: string;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    typeFilter: string;
    setTypeFilter: (filter: string) => void;
}

export function WalletTransactions({
    transactions,
    role,
    page,
    totalPages,
    setPage,
    typeFilter,
    setTypeFilter,
}: WalletTransactionsProps) {
    const { t } = useTranslation();

    const DEBIT_TYPES = ["PAYMENT", "WALLET_DEBIT", "COMMISSION_DEBIT"];

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                    {t(translationKey.wallet.recentTransactions)}
                </h2>
                <div className="w-full sm:w-[220px]">
                    <Select
                        value={typeFilter || "ALL"}
                        onValueChange={(val) => {
                            setTypeFilter(val === "ALL" ? "" : val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full bg-neutral-50 border-neutral-200 rounded-xl h-11 shadow-sm focus:ring-black transition-colors hover:bg-neutral-100">
                            <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="All Transactions" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-neutral-200 shadow-xl">
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

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider font-semibold border-b border-neutral-100">
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6">Description</th>
                            <th className="py-4 px-6">Type</th>
                            <th className="py-4 px-6">Payment Method</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {transactions.length > 0 ? (
                            transactions.map((tx: ITransaction) => {
                                const isCredit = !DEBIT_TYPES.includes(tx.type);
                                return (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-neutral-50/50 transition-colors group"
                                    >
                                        <td className="py-4 px-6 text-sm">
                                            <div className="font-medium text-neutral-900">
                                                {new Date(
                                                    tx.createdAt
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-neutral-500 mt-1">
                                                {new Date(
                                                    tx.createdAt
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-neutral-900 font-medium">
                                                {tx.description || tx.type}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                ID: {tx.bookingId || "N/A"}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <Popover>
                                                <PopoverTrigger>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-none rounded-lg px-3 py-1 cursor-help flex items-center gap-1.5 font-medium transition-colors"
                                                    >
                                                        {tx.type}
                                                        <Info className="w-3 h-3 text-neutral-400" />
                                                    </Badge>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-64 text-sm rounded-xl p-4 shadow-xl border-neutral-200"
                                                    side="top"
                                                >
                                                    <p className="font-bold text-neutral-900 mb-2">
                                                        {tx.type}
                                                    </p>
                                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                                        Detailed information
                                                        regarding this specific
                                                        transaction type.
                                                    </p>
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-600 font-medium">
                                            {tx.paymentMethod || "N/A"}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span
                                                className={`text-sm font-bold ${
                                                    isCredit
                                                        ? "text-neutral-900"
                                                        : "text-neutral-500"
                                                }`}
                                            >
                                                {isCredit ? "+" : "-"}₹
                                                {tx.amount?.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-16 text-center text-neutral-500 text-sm font-medium"
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-neutral-100 flex justify-between items-center bg-white">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-xl border-neutral-200 shadow-sm font-medium hover:bg-neutral-50 h-10 px-4"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-neutral-500 font-medium bg-neutral-50 px-3 py-1 rounded-lg">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-xl border-neutral-200 shadow-sm font-medium hover:bg-neutral-50 h-10 px-4"
                    >
                        Next
                    </Button>
                </div>
            )}
        </Card>
    );
}
