import { WalletComponent } from "@/components/common/Wallet/WalletComponent";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

export default function AdminTransactions() {
    const { t } = useTranslation();

    return (
        <div className="pt-8">
            <WalletComponent
                role="ADMIN"
                title={t(translationKeys.transactions.adminTitle)}
                customLabels={{
                    totalCredits: t(
                        translationKeys.transactions.totalCommission
                    ),
                    totalDebits: "Refunds / Debits",
                }}
            />
        </div>
    );
}
