import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import {
    createRoomVariant,
    deleteRoomVariantImage,
    getRoomVariantById,
    getRoomVariantByHotelId,
    updateRoomVariant,
    getRoomVariantAvailability,
} from "@/services/api/roomVariant.ApiService";
import type { IGetRoomVariantAvailabilityRequestDTO } from "@/types/api/requests/roomVariantRequests";
import type { IRoomVariantDetailResponse } from "@/types/api/responses/roomVariantDetailResponse";
import type { IRoomVariantListingResponse } from "@/types/api/responses/roomVariantListingResponse";
import type { IGetRoomVariantAvailabilityResponseDTO } from "@/types/api/responses/roomVariantResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createRoomVariantMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { hotelId: string; data: FormData }
    >({
        mutationFn: createRoomVariant,
    });
}

export function createGetRoomVariantByHotelIdQueryOptions(hotelId: string) {
    return queryOptions<HttpResponse<IRoomVariantListingResponse>>({
        queryKey: [QUERY_KEYS.ROOM_VARIANT, hotelId],
        queryFn: () => getRoomVariantByHotelId(hotelId),
    });
}

export function createGetRoomVariantByIdQueryOptions(roomVariantId: string) {
    return queryOptions<HttpResponse<IRoomVariantDetailResponse>>({
        queryKey: [QUERY_KEYS.ROOM_VARIANT, roomVariantId],
        queryFn: () => getRoomVariantById(roomVariantId),
    });
}

export function createUpdateRoomVariantMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { roomVariantId: string; data: FormData }
    >({
        mutationFn: updateRoomVariant,
    });
}

export function createDeleteRoomVariantImageMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { roomVariantId: string; index: number }
    >({
        mutationFn: deleteRoomVariantImage,
    });
}

export function createGetRoomVariantAvailabilityQueryOptions({
    roomVariantId,
    checkinDate,
    checkoutDate,
}: IGetRoomVariantAvailabilityRequestDTO) {
    return queryOptions<
        HttpResponse<IGetRoomVariantAvailabilityResponseDTO>,
        Error
    >({
        queryKey: [
            QUERY_KEYS.ROOM_VARIANT_AVAILABILITY,
            roomVariantId,
            checkinDate,
            checkoutDate,
        ],
        queryFn: () =>
            getRoomVariantAvailability({
                roomVariantId,
                checkinDate,
                checkoutDate,
            }),
        refetchOnWindowFocus: true,
        staleTime: 1000 * 5,
    });
}
