import { createRoom, editRoom } from "@/services/api/room.ApiService";
import type {
    CreateRoomData,
    EditRoomData,
} from "@/services/api/room.ApiService";
import type { HttpResponse } from "@/types/api/responseType";
import { mutationOptions } from "@tanstack/react-query";

export function createRoomMutationOptions() {
    return mutationOptions<HttpResponse<object>, Error, CreateRoomData>({
        mutationFn: createRoom,
    });
}

export function editRoomMutationOptions(roomId: string) {
    return mutationOptions<HttpResponse<object>, Error, EditRoomData>({
        mutationFn: (data) => editRoom(roomId, data),
    });
}
