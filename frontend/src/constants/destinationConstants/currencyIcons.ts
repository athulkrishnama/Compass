import {
    IndianRupee,
    DollarSign,
    Euro,
    PoundSterling,
    JapaneseYen,
    Banknote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CURRENCY } from "@/constants/destinationConstants/currency";

export const currencyIcons: Record<CURRENCY, LucideIcon> = {
    [CURRENCY.INR]: IndianRupee,
    [CURRENCY.USD]: DollarSign,
    [CURRENCY.EUR]: Euro,
    [CURRENCY.GBP]: PoundSterling,
    [CURRENCY.AUD]: DollarSign,
    [CURRENCY.CAD]: DollarSign,
    [CURRENCY.JPY]: JapaneseYen,
    [CURRENCY.CNY]: JapaneseYen,
    [CURRENCY.CHF]: Banknote,
    [CURRENCY.SGD]: DollarSign,
    [CURRENCY.AED]: Banknote,
    [CURRENCY.SAR]: Banknote,
    [CURRENCY.THB]: Banknote,
    [CURRENCY.MYR]: Banknote,
    [CURRENCY.IDR]: Banknote,
    [CURRENCY.PHP]: Banknote,
    [CURRENCY.VND]: Banknote,
    [CURRENCY.KRW]: Banknote,
    [CURRENCY.NZD]: DollarSign,
    [CURRENCY.ZAR]: Banknote,
    [CURRENCY.BRL]: Banknote,
    [CURRENCY.MXN]: Banknote,
    [CURRENCY.RUB]: Banknote,
    [CURRENCY.TRY]: Banknote,
    [CURRENCY.HKD]: DollarSign,
};
