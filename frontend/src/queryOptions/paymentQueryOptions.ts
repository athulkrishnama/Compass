import { createPaymentIntent } from "@/services/api/paymentService";
import type { ICreatePaymentIntentRequestDTO } from "@/types/api/requests/paymentRequests";
import type { ICreatePaymentIntentResponseDTO } from "@/types/api/responses/paymentResponses";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions } from "@tanstack/react-query";

export const createCreatePaymentIntentMutationOptions = () => {
    return mutationOptions<
        HttpResponse<ICreatePaymentIntentResponseDTO>,
        Error,
        ICreatePaymentIntentRequestDTO
    >({
        mutationFn: createPaymentIntent,
    });
};
