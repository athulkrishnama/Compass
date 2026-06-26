import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTopUpPaymentIntent } from "@/services/api/walletService";
import { StripeTopUpView } from "./StripeTopUpView";

interface WalletTopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalletTopUpModal({ isOpen, onClose }: WalletTopUpModalProps) {
    const [topUpAmount, setTopUpAmount] = useState("");
    const [isToppingUp, setIsToppingUp] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleTopUp = async () => {
        if (!topUpAmount || isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0) return;
        setIsToppingUp(true);
        try {
            const { clientSecret } = await createTopUpPaymentIntent(Number(topUpAmount));
            setClientSecret(clientSecret);
        } catch (error) {
            console.error("Top-up failed", error);
        } finally {
            setIsToppingUp(false);
        }
    };

    const handleClose = () => {
        setTopUpAmount("");
        setClientSecret(null);
        onClose();
    };

    const handleSuccess = () => {
        handleClose();
        window.location.reload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
                <div className="p-8">
                    {clientSecret ? (
                        <StripeTopUpView
                            clientSecret={clientSecret}
                            amount={Number(topUpAmount)}
                            onSuccess={handleSuccess}
                            onBack={() => setClientSecret(null)}
                        />
                    ) : (
                        <>
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-bold text-neutral-900 tracking-tight">
                                    Top Up Wallet
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mb-8">
                                <div className="space-y-3">
                                    <Label htmlFor="amount" className="text-neutral-700 font-medium text-sm uppercase tracking-wider">
                                        Amount (₹)
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                        className="rounded-xl border-neutral-200 focus-visible:ring-black focus-visible:border-black h-14 text-lg bg-neutral-50"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex gap-3 sm:justify-end">
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isToppingUp}
                                    className="rounded-xl font-medium h-12 px-6 border-neutral-200 hover:bg-neutral-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleTopUp}
                                    disabled={isToppingUp || !topUpAmount || Number(topUpAmount) <= 0}
                                    className="bg-black hover:bg-neutral-800 text-white rounded-xl font-medium h-12 px-6 transition-all active:scale-[0.98]"
                                >
                                    {isToppingUp && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Proceed to Pay
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
