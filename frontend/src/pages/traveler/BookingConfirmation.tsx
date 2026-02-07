import { motion } from "framer-motion";
import { useSearch } from "@tanstack/react-router";
import HotelDetailsCard from "@/components/traveler/bookingConfirmation/HotelDetailsCard";
import RoomSelectionCard from "@/components/traveler/bookingConfirmation/RoomSelectionCard";
import StayDetailsCard from "@/components/traveler/bookingConfirmation/StayDetailsCard";
import PaymentSummaryCard from "@/components/traveler/bookingConfirmation/PaymentSummaryCard";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

const mockData = {
    hotel: {
        name: "Grand Plaza Residency",
        address: "Opposite of PS Mission Hospital, New Delhi, 110019, India",
        description:
            "Premium Hotel in the heart of New Delhi. Featuring world-class amenities and exceptional service.",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    },
    room: {
        name: "Executive Premium Suite",
        type: "Luxury Suite",
        bedConfig: "1 King Bed",
        view: "City View",
        amenities: ["FREE WIFI", "AC"],
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function BookingConfirmation() {
    const { t } = useTranslation();
    const search = useSearch({ from: "/traveler/booking-confirmation" });
    const {
        roomVariantId,
        checkInDate,
        checkOutDate,
        guests,
        paymentIntentId,
        clientSecret,
        amount,
    } = search;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log("Room Variant ID:", roomVariantId, "Guests:", guests);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t(translationKey.bookingConfirmation.confirmAndPay)}
                    </h1>
                    <p className="text-gray-500">
                        {t(
                            translationKey.bookingConfirmation.reviewStayDetails
                        )}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-8">
                        <HotelDetailsCard
                            name={mockData.hotel.name}
                            address={mockData.hotel.address}
                            description={mockData.hotel.description}
                            image={mockData.hotel.image}
                        />
                        <RoomSelectionCard
                            name={mockData.room.name}
                            type={mockData.room.type}
                            bedConfig={mockData.room.bedConfig}
                            view={mockData.room.view}
                            amenities={mockData.room.amenities}
                            image={mockData.room.image}
                        />
                        <StayDetailsCard
                            checkInDate={checkIn}
                            checkOutDate={checkOut}
                            nights={nights}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <PaymentSummaryCard
                            amount={amount}
                            nights={nights}
                            paymentIntentId={paymentIntentId}
                            clientSecret={clientSecret}
                        />
                    </div>
                </motion.div>
            </div>

            <footer className="border-t border-gray-200 mt-12 py-8">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} {mockData.hotel.name} • New
                    Delhi, India
                </div>
            </footer>
        </div>
    );
}
