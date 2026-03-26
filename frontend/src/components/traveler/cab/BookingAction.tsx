import { ChevronRight } from "lucide-react";

interface BookingActionProps {
    selectedCab: string | null;
}

const BookingAction = ({ selectedCab }: BookingActionProps) => {
    return (
        <div className="fixed md:absolute bottom-0 left-0 right-0 bg-white p-4 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-gray-100">
            <button
                disabled={!selectedCab}
                className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300
                    ${
                        selectedCab
                            ? "bg-black text-white hover:bg-gray-900 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }
                `}
            >
                {selectedCab
                    ? `Choose ${
                          selectedCab.charAt(0) +
                          selectedCab.slice(1).toLowerCase()
                      }`
                    : "Select a ride"}
                {selectedCab && <ChevronRight className="w-6 h-6 ml-1" />}
            </button>
        </div>
    );
};

export default BookingAction;
