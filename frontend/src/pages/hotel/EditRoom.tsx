import Loading from "@/components/shared/loading/Loading";
import { createGetRoomByIdQueryOptions } from "@/queryOptions/roomQueryOptions";
import { createGetHotelByIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { EditRoomForm } from "@/components/room/EditRoom";

const routeApi = getRouteApi("/hotel/hotels/$hotelId_/rooms/$roomId/edit");

function EditRoomContent() {
    const { hotelId, roomId } = routeApi.useParams();
    const { t } = useTranslation();

    const {
        data: { data: roomData },
    } = useSuspenseQuery(createGetRoomByIdQueryOptions(roomId));

    const {
        data: { data: hotelData },
    } = useSuspenseQuery(createGetHotelByIdQueryOptions(hotelId));

    if (!roomData) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                    {t(translationKey.text.noRoomFound)}
                </p>
            </div>
        );
    }

    return (
        <EditRoomForm
            roomData={roomData}
            hotelId={hotelId}
            hotelName={hotelData?.name || ""}
        />
    );
}

function EditRoom() {
    return (
        <Suspense
            fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <Loading />
                </div>
            }
        >
            <EditRoomContent />
        </Suspense>
    );
}

export default EditRoom;
