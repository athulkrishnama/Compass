import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import translationKey from "@/utils/i18n/translationKey";
import { AddDestinationForm } from "@/components/admin/AddDestination";

function AddDestinations() {
    const { t } = useTranslation();

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-gray-900">
                    {t(translationKey.headings.addNewDestination)}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {t(translationKey.headings.addDestinationSubtitle)}
                </p>
            </motion.div>

            <AddDestinationForm />
        </div>
    );
}

export default AddDestinations;
