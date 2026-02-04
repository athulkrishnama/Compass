import { axiosInstance } from "@/axios/instance";
import { ROOM_VARIANT_ROUTES } from "@/constants/routes/roomVariantRoutes";
import type { IGetRoomVariantAvailabilityRequestDTO } from "@/types/api/requests/roomVariantRequests";
import { AxiosError } from "axios";

export async function createRoomVariant({
    hotelId,
    data,
}: {
    hotelId: string;
    data: FormData;
}) {
    try {
        const response = await axiosInstance.post(
            ROOM_VARIANT_ROUTES.BY_HOTEL.replace(":hotelId", hotelId),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getRoomVariantByHotelId(hotelId: string) {
    try {
        const response = await axiosInstance.get(
            ROOM_VARIANT_ROUTES.BY_HOTEL.replace(":hotelId", hotelId)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getRoomVariantById(roomVariantId: string) {
    try {
        const response = await axiosInstance.get(
            ROOM_VARIANT_ROUTES.BY_ID.replace(":id", roomVariantId)
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function updateRoomVariant({
    roomVariantId,
    data,
}: {
    roomVariantId: string;
    data: FormData;
}) {
    try {
        const response = await axiosInstance.patch(
            ROOM_VARIANT_ROUTES.BY_ID.replace(":id", roomVariantId),
            data
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function deleteRoomVariantImage({
    roomVariantId,
    index,
}: {
    roomVariantId: string;
    index: number;
}) {
    try {
        const response = await axiosInstance.delete(
            ROOM_VARIANT_ROUTES.IMAGE.replace(":id", roomVariantId).replace(
                ":index",
                index.toString()
            )
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}

export async function getRoomVariantAvailability({
    roomVariantId,
    checkinDate,
    checkoutDate,
}: IGetRoomVariantAvailabilityRequestDTO) {
    try {
        const response = await axiosInstance.get(
            ROOM_VARIANT_ROUTES.AVAILABILITY.replace(
                ":roomVariantId",
                roomVariantId
            ),
            {
                params: {
                    checkinDate: checkinDate.toDateString(),
                    checkoutDate: checkoutDate.toDateString(),
                },
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("something went wrong");
    }
}
