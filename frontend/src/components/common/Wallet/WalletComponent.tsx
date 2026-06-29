import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Wallet as WalletIcon, Loader2, Plus } from "lucide-react";
import {
    getWalletSummary,
    getWalletTransactions,
} from "@/services/api/walletService";
import translationKey from "@/utils/i18n/translationKey";
import { Button } from "@/components/ui/button";

import { WalletSummary } from "./WalletSummary";
import { WalletTransactions } from "./WalletTransactions";
import { WalletTopUpModal } from "./WalletTopUpModal";

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
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
            </div>
        );
    }

    const transactions = transactionsData?.transactions || [];
    const totalPages = transactionsData?.totalPages || 0;

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-neutral-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-neutral-200">
                            <WalletIcon className="w-6 h-6 text-neutral-900" />
                        </div>
                        {title || t(translationKey.wallet.myWallet)}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-2 font-medium">
                        {t(translationKey.wallet.manageTransactions)}
                    </p>
                </div>
                {role === "USER" && (
                    <Button
                        onClick={() => setIsTopUpModalOpen(true)}
                        className="bg-black hover:bg-neutral-800 text-white shadow-lg shadow-black/5 rounded-xl font-medium px-6 h-12 flex items-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Top Up Wallet
                    </Button>
                )}
            </div>

            <WalletSummary summary={summary} customLabels={customLabels} />

            <WalletTransactions
                transactions={transactions}
                role={role}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
            />

            {role === "USER" && (
                <WalletTopUpModal
                    isOpen={isTopUpModalOpen}
                    onClose={() => setIsTopUpModalOpen(false)}
                />
            )}
        </div>
    );
}
