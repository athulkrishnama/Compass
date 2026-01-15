export interface RoomListingItem {
    id: string;
    name: string;
    code: string;
    coverImage: string;
    basePrice: number;
}

export interface IRoomListingResponse {
    rooms: RoomListingItem[];
    count: number;
}
