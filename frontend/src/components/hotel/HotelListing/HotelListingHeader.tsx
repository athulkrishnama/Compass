import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface HotelListingHeaderProps {
    count: number;
}

export function HotelListingHeader({ count }: HotelListingHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t(translationKey.headings.hotelManagement)}
                </h1>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {count}{" "}
                    {t(translationKey.text.propertiesManaged, { count })}
                </p>
            </div>
            <Button asChild className="rounded-full px-6">
                <Link to="/hotel/hotels/add">
                    <Plus className="mr-2 h-4 w-4" />
                    {t(translationKey.button.addHotel)}
                </Link>
            </Button>
        </header>
    );
}
