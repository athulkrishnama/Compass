import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingDisplayProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
    totalReviews?: number;
    className?: string;
}

const StarRatingDisplay = ({
    rating,
    maxRating = 5,
    size = "sm",
    showCount = false,
    totalReviews = 0,
    className,
}: StarRatingDisplayProps) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center gap-0.5">
                {[...Array(maxRating)].map((_, index) => {
                    const isFull = index < fullStars;
                    const isHalf = index === fullStars && hasHalfStar;

                    if (isFull) {
                        return (
                            <Star
                                key={index}
                                className={cn(
                                    sizeClasses[size],
                                    "fill-black text-black"
                                )}
                            />
                        );
                    } else if (isHalf) {
                        return (
                            <div key={index} className="relative">
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        "text-gray-200 fill-gray-200"
                                    )}
                                />
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                    <Star
                                        className={cn(
                                            sizeClasses[size],
                                            "fill-black text-black"
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <Star
                                key={index}
                                className={cn(
                                    sizeClasses[size],
                                    "fill-gray-200 text-gray-200"
                                )}
                            />
                        );
                    }
                })}
            </div>
            {showCount && (
                <span className="text-sm text-gray-500 font-medium">
                    {rating.toFixed(1)} ({totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"})
                </span>
            )}
        </div>
    );
};

export default StarRatingDisplay;
