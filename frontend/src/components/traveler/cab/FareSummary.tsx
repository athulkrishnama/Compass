import { Navigation, Clock } from "lucide-react";

interface FareSummaryProps {
    distance: number;
    time: number;
}

const FareSummary = ({ distance, time }: FareSummaryProps) => {
    return (
        <div className="flex items-center space-x-4 text-sm font-medium text-gray-800 mt-4 bg-white p-4 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Navigation className="w-4 h-4 text-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-normal">
                        Distance
                    </span>
                    <span className="font-bold text-base">
                        {distance.toFixed(1)} km
                    </span>
                </div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex items-center flex-1 pl-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-normal">
                        Est. Time
                    </span>
                    <span className="font-bold text-base">
                        {Math.ceil(time)} min
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FareSummary;
