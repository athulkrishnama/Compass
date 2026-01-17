import {
    createRoom,
    deleteRoomImage,
    getRoomById,
    getRoomByHotelId,
    updateRoom,
} from "@/services/api/room.ApiService";
import type { IRoomDetailResponse } from "@/types/api/responses/roomDetailResponse";
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

export function createGetRoomByIdQueryOptions(roomId: string) {
    return queryOptions<HttpResponse<IRoomDetailResponse>>({
        queryKey: ["room", roomId],
        queryFn: () => getRoomById(roomId),
    });
}

export function createUpdateRoomMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { roomId: string; data: FormData }
    >({
        mutationFn: updateRoom,
    });
}

export function createDeleteRoomImageMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { roomId: string; index: number }
    >({
        mutationFn: deleteRoomImage,
    });
}
