import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import DestinationHero from "@/components/traveler/destinationDetail/DestinationHero";
import DestinationDescription from "@/components/traveler/destinationDetail/DestinationDescription";
import DestinationInfo from "@/components/traveler/destinationDetail/DestinationInfo";
import DestinationBestTime from "@/components/traveler/destinationDetail/DestinationBestTime";
import DestinationActivities from "@/components/traveler/destinationDetail/DestinationActivities";
import DestinationGallery from "@/components/traveler/destinationDetail/DestinationGallery";
import DestinationMapSection from "@/components/traveler/destinationDetail/DestinationMapSection";
import { createFindDestinationByIdQueryOption } from "@/queryOptions/destinationQueryOptions";
import translationKey from "@/utils/i18n/translationKey";

function DestinationDetail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams({ from: "/traveler/destination/$id" });

    const { data } = useSuspenseQuery(createFindDestinationByIdQueryOption(id));
    const destination = data?.data;

    if (!destination) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    {t(translationKey.text.noDestinationsFound)}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Sticky Back Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sticky top-6 z-50 w-fit ml-6 -mb-12"
            >
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => navigate({ to: "/traveler/destinations" })}
                    className="rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white border border-gray-100 w-12 h-12"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Button>
            </motion.div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <DestinationHero
                    coverImage={destination.coverImage}
                    name={destination.name}
                    tagline={destination.tagline}
                    type={destination.type}
                    activities={destination.activities}
                />

                {/* Content Grid */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <DestinationDescription
                            description={destination.description}
                        />
                        <DestinationBestTime
                            bestMonths={destination.bestTimeToVisit}
                        />
                        <DestinationActivities
                            activities={destination.activities}
                        />
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <DestinationInfo
                            entryFee={destination.entryFee}
                            isFree={destination.isFree}
                            isAlwaysOpen={destination.isAlwaysOpen}
                            openingTime={destination.openingTime}
                            closingTime={destination.closingTime}
                            closedDays={destination.closedDays}
                            city={destination.city}
                            country={destination.country}
                            isWheelChairAccessible={
                                destination.isWheelChairAccessible
                            }
                        />
                    </div>
                </div>

                {/* Gallery Section */}
                <DestinationGallery
                    images={destination.images}
                    name={destination.name}
                />

                {/* Map Section */}
                <DestinationMapSection coordinates={destination.coordinates} />
            </main>
        </div>
    );
}

export default DestinationDetail;
