import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { IRoomVariantDetailResponse } from "@/types/api/responses/roomVariantDetailResponse";
import {
    Users,
    Bed,
    Clock,
    Cigarette,
    PawPrint,
    Image as ImageIcon,
} from "lucide-react";
import { BED_TYPE_WITH_TRANSLATION } from "@/constants/roomConstants/bedTypeWithTranslation";
import { getAmenityDetails } from "@/constants/roomConstants/roomAmenityWithIconAndTranslation";
import { useState } from "react";

interface RoomVariantHeaderProps {
    roomVariant: IRoomVariantDetailResponse;
}

export default function RoomVariantHeader({
    roomVariant,
}: RoomVariantHeaderProps) {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(roomVariant.coverImage);

    const getBedTypeName = (type: string) => {
        const config = BED_TYPE_WITH_TRANSLATION.find((b) => b.value === type);
        return config ? t(config.labelKey) : type;
    };

    const allImages = [roomVariant.coverImage, ...roomVariant.images];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="relative h-64 lg:h-80 bg-gray-200">
                            <img
                                src={selectedImage}
                                alt={roomVariant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md">
                                    {roomVariant.name}
                                </span>
                            </div>
                        </div>
                        {allImages.length > 1 && (
                            <div className="p-3 bg-gray-50 border-t border-gray-100 ">
                                <div className="flex gap-2 overflow-x-auto hide-scroll-bar">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(img)
                                            }
                                            className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === img
                                                    ? "border-gray-900"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${roomVariant.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                    <ImageIcon className="w-3 h-3" />
                                    {allImages.length}{" "}
                                    {t(translationKey.text.imagesUploaded)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {roomVariant.name}
                                </h1>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">
                                    {t(translationKey.text.variantId)}:{" "}
                                    {roomVariant.id.slice(-6).toUpperCase()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{roomVariant.basePrice.toLocaleString()}
                                </span>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    {t(translationKey.text.perNight)}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                            {roomVariant.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.text.maxOccupancy)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {roomVariant.maxOccupancy}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.text.bedding)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {roomVariant.bedConfig.count}{" "}
                                        {getBedTypeName(
                                            roomVariant.bedConfig.type
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.form.checkIn)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {roomVariant.policies.checkInTime}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.form.checkOut)}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {roomVariant.policies.checkOutTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    roomVariant.policies.smokingAllowed
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                <Cigarette className="w-3 h-3" />
                                {roomVariant.policies.smokingAllowed
                                    ? t(
                                          translationKey.roomDetails
                                              .smokingAllowed
                                      )
                                    : t(
                                          translationKey.roomDetails
                                              .smokingNotAllowed
                                      )}
                            </div>
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    roomVariant.policies.petsAllowed
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                <PawPrint className="w-3 h-3" />
                                {roomVariant.policies.petsAllowed
                                    ? t(translationKey.roomDetails.petsAllowed)
                                    : t(
                                          translationKey.roomDetails
                                              .petsNotAllowed
                                      )}
                            </div>
                        </div>

                        {roomVariant.amenities.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                                    {t(translationKey.form.roomAmenities)}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {roomVariant.amenities.map((amenity) => {
                                        const details =
                                            getAmenityDetails(amenity);
                                        const IconComponent = details?.icon;
                                        const label = details
                                            ? t(details.labelKey)
                                            : amenity.replace(/_/g, " ");

                                        return (
                                            <span
                                                key={amenity}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                            >
                                                {IconComponent && (
                                                    <IconComponent className="w-3 h-3" />
                                                )}
                                                {label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
