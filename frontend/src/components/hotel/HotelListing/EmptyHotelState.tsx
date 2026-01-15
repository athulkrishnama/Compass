import { Button } from "@/components/ui/button";
import { Plus, Hotel } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

export function EmptyHotelState() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/30"
        >
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Hotel className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
                {t(translationKey.headings.noPropertiesFound)}
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8">
                {t(translationKey.text.noHotelsDescription)}
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/hotel/hotels/add">
                    <Plus className="mr-2 h-5 w-5" />
                    {t(translationKey.button.addFirstHotel)}
                </Link>
            </Button>
        </motion.div>
    );
}
