import { WalletComponent } from "@/components/common/Wallet/WalletComponent";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

export default function HotelTransactions() {
    const { t } = useTranslation();

    return (
        <div className="pt-8">
            <WalletComponent 
                role="HOTEL" 
                title={t(translationKeys.transactions.title)} 
            />
        </div>
    );
}
