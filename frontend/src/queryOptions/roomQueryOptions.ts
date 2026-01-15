import { createRoom, getRoomByHotelId } from "@/services/api/room.ApiService";
import type { IRoomListingResponse } from "@/types/api/responses/roomListingResponse";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function createRoomMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { hotelId: string; data: FormData }
    >({
        mutationFn: createRoom,
    });
}

export function createGetRoomByHotelIdQueryOptions(hotelId: string) {
    return queryOptions<HttpResponse<IRoomListingResponse>>({
        queryKey: ["rooms", hotelId],
        queryFn: () => getRoomByHotelId(hotelId),
    });
}
