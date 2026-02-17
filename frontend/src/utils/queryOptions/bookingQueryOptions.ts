import { queryOptions } from "@tanstack/react-query";
import { getBookingByPaymentId } from "@/services/api/bookingService";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { BookingStatusResponseStatus } from "@/types/booking";

export const bookingQueryOptions = {
    getBookingByPaymentId: (paymentId: string) =>
        queryOptions({
            queryKey: [QUERY_KEYS.BOOKING, paymentId],
            queryFn: () => getBookingByPaymentId(paymentId),
            refetchInterval: (query) => {
                const data = query.state.data;
                if (data?.status === BookingStatusResponseStatus.PENDING) {
                    return 1000;
                }
                return false;
            },
            enabled: !!paymentId,
        }),
};
