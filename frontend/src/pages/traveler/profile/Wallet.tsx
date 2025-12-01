import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Wallet() {
    const walletData = {
        balance: 0,
        transactions: [],
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="bg-gray-50">
                        <CardContent className="pt-6">
                            <p className="text-sm text-gray-600 mb-1">
                                Current Balance
                            </p>
                            <p className="text-3xl font-bold">
                                ${walletData.balance.toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Transaction History
                        </h3>
                        {walletData.transactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No transactions yet
                            </p>
                        ) : (
                            <div className="space-y-2"></div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default Wallet;
