import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
}

function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-800">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </motion.div>
    );
}

export default SectionCard;
