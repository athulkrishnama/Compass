import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const StarRatingInput = ({
    rating,
    onRatingChange,
    maxRating = 5,
    size = "md",
    disabled = false,
}: StarRatingInputProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = (hoverRating || rating) >= starValue;

                return (
                    <button
                        type="button"
                        key={starValue}
                        disabled={disabled}
                        className={cn(
                            "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm",
                            disabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:scale-110"
                        )}
                        onClick={() => onRatingChange(starValue)}
                        onMouseEnter={() =>
                            !disabled && setHoverRating(starValue)
                        }
                        onMouseLeave={() => !disabled && setHoverRating(0)}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled
                                    ? "fill-black text-black"
                                    : "fill-transparent text-gray-300"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRatingInput;
