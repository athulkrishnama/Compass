export interface Hotel {
    id: string;
    name: string;
    description: string;
    city: string;
    country: string;
    coverImage: string;
}

export interface IGetHotelsByUserIdResponse {
    hotels: Hotel[];
    count: number;
}
