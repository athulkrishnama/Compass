export interface IHotelSearchRequestDTO {
    queryString?: string;
    city?: [number, number];
    proximityRadius?: number;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    maxPrice?: number;
    minPrice?: number;
    pageNo: number;
}

export interface RoomVariant {
    _id?: string;
    name: string;
    price: number;
    maxOccupancy: number;
    coverImage: string;
}

export interface IHotelWithRoomVariantDetails {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    images?: string[];
    city: string;
    country?: string;
    roomVariants: RoomVariant[];
}

export interface IHotelSearchResponseDTO {
    hotels: IHotelWithRoomVariantDetails[];
    pageNo: number;
}
