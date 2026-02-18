import { useQuery } from "@tanstack/react-query";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { useNavigate } from "@tanstack/react-router";
import Loading from "@/components/shared/loading/Loading";
import { useTranslation } from "react-i18next";
import translationKeys from "@/utils/i18n/translationKey";

export default function HotelBookings() {
    const { data, isLoading } = useQuery(createGetHotelsByUserIdQueryOptions());
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (isLoading) return <Loading />;

    const hotels = data?.data?.hotels || [];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {t(translationKeys.hotelBookingListing.selectHotel)}
            </h1>

            {hotels.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">
                        {t(translationKeys.hotelBookingListing.noHotelsFound)}
                    </p>
                    <p className="text-sm mt-2">
                        {t(
                            translationKeys.hotelBookingListing
                                .noHotelsDescription
                        )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                        <button
                            key={hotel.id}
                            onClick={() =>
                                navigate({
                                    to: "/hotel/bookings/$hotelId",
                                    params: { hotelId: hotel.id },
                                })
                            }
                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left cursor-pointer border border-gray-100"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={hotel.coverImage}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {hotel.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {hotel.city}, {hotel.country}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
