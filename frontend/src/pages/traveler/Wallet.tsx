import { WalletComponent } from "@/components/common/Wallet/WalletComponent";

function Wallet() {
    return (
        <div className="min-h-screen bg-gray-50/50 pt-20">
            <WalletComponent role="USER" />
        </div>
    );
}

export default Wallet;
