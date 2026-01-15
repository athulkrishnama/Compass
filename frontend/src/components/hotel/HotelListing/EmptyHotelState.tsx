import { Button } from "@/components/ui/button";
import { Plus, Hotel } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function EmptyHotelState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-3xl bg-muted/30"
        >
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Hotel className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Properties Found</h2>
            <p className="text-muted-foreground max-w-sm mb-8">
                You haven't added any hotels yet. Start by adding your first
                property to manage it here.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/hotel/hotels/add">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Hotel
                </Link>
            </Button>
        </motion.div>
    );
}
