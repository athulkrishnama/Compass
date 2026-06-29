import { axiosInstance } from "@/axios/instance";
import { AxiosError } from "axios";

export const WalletRoutes = {
    SUMMARY: "/wallet/summary",
    TRANSACTIONS: "/wallet/transactions",
    TOP_UP: "/wallet/top-up",
};

export interface IWalletSummaryData {
    walletId: string;
    ownerId: string;
    ownerType: string;
    balance: number;
    totalCredits: number;
    totalDebits: number;
    pendingAmount: number;
}

export interface ITransactionQuery {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "latest" | "oldest" | "highestAmount" | "lowestAmount";
    type?: string;
    paymentMethod?: string;
    serviceType?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
}

export async function getWalletSummary(): Promise<IWalletSummaryData> {
    try {
        const response = await axiosInstance.get(WalletRoutes.SUMMARY);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data.message || "Failed to fetch wallet summary"
            );
        }
        throw new Error("Something went wrong");
    }
}

export interface ITransaction {
    id: string;
    bookingId: string;
    ownerType: string;
    ownerId: string;
    paymentMethod?: string;
    amount: number;
    commissionRate?: number;
    commissionAmount?: number;
    type: string;
    description?: string;
    createdAt: string;
}

export interface IGetWalletTransactionsResponse {
    transactions: ITransaction[];
    total: number;
    totalPages: number;
}

export async function getWalletTransactions(
    params: ITransactionQuery
): Promise<IGetWalletTransactionsResponse> {
    try {
        const response = await axiosInstance.get(WalletRoutes.TRANSACTIONS, {
            params,
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data.message || "Failed to fetch transactions"
            );
        }
        throw new Error("Something went wrong");
    }
}

export async function createTopUpPaymentIntent(
    amount: number
): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
        const response = await axiosInstance.post(WalletRoutes.TOP_UP, {
            amount,
        });
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(
                error.response?.data.message ||
                    "Failed to create top-up payment intent"
            );
        }
        throw new Error("Something went wrong");
    }
}
