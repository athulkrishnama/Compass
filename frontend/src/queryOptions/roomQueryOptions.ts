import { createRoom } from "@/services/api/room.ApiService";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions } from "@tanstack/react-query";

export function createRoomMutationOptions() {
    return mutationOptions<
        HttpResponse<object>,
        Error,
        { hotelId: string; data: FormData }
    >({
        mutationFn: createRoom,
    });
}
