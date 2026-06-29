import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet as WalletIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface WalletSummaryProps {
    summary?: {
        balance: number;
        totalCredits: number;
        totalDebits: number;
    };
    customLabels?: {
        totalCredits?: string;
        totalDebits?: string;
    };
}

export function WalletSummary({ summary, customLabels }: WalletSummaryProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black text-white rounded-2xl shadow-lg border-0 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8 relative z-10">
                    <p className="text-neutral-400 font-medium mb-2 text-sm uppercase tracking-wider">
                        {t(translationKey.wallet.totalBalance)}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        ₹{summary?.balance?.toFixed(2) || "0.00"}
                    </h2>
                </CardContent>
                <WalletIcon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border border-neutral-200 transition-transform duration-300 hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-xl">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                        <p className="text-neutral-500 font-medium text-sm uppercase tracking-wider">
                            {customLabels?.totalCredits || "Total Credits"}
                        </p>
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">
                        ₹{summary?.totalCredits?.toFixed(2) || "0.00"}
                    </h3>
                </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border border-neutral-200 transition-transform duration-300 hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2.5 bg-neutral-100 text-neutral-900 rounded-xl">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <p className="text-neutral-500 font-medium text-sm uppercase tracking-wider">
                            {customLabels?.totalDebits || "Total Debits"}
                        </p>
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">
                        ₹{summary?.totalDebits?.toFixed(2) || "0.00"}
                    </h3>
                </CardContent>
            </Card>
        </div>
    );
}
