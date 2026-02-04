import { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import useThrottle from "@/hooks/useThrottle";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ImageCropperProps {
    image: File;
    ratio?: number;
    onCropComplete: (image?: File) => void;
}

function ImageCropper({ ratio, image, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>({
        height: 0,
        unit: "px",
        width: 0,
        x: 0,
        y: 0,
    });

    const { t } = useTranslation();

    const imgRef = useRef<HTMLImageElement | null>(null);

    const throttledHandleCrop = useThrottle((c: Crop) => setCrop(c), 50);

    async function handleCropComplete() {
        if (!imgRef.current || !crop?.width || !crop?.height) return;

        const image = imgRef.current;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelX = Math.round(crop.x * scaleX);
        const pixelY = Math.round(crop.y * scaleY);
        const pixelWidth = Math.round(crop.width * scaleX);
        const pixelHeight = Math.round(crop.height * scaleY);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = pixelWidth;
        canvas.height = pixelHeight;

        ctx.drawImage(
            image,
            pixelX,
            pixelY,
            pixelWidth,
            pixelHeight,
            0,
            0,
            pixelWidth,
            pixelHeight
        );

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                onCropComplete(
                    new File([blob], "cropped.webp", { type: "image/webp" })
                );
            },
            "image/webp",
            0.85
        );
    }

    return (
        <div className="p-5">
            <ReactCrop
                ruleOfThirds
                crop={crop}
                onChange={throttledHandleCrop}
                aspect={ratio}
                className="w-full"
            >
                <img
                    ref={imgRef}
                    src={URL.createObjectURL(image)}
                    alt="Crop target"
                    className="w-full"
                />
            </ReactCrop>

            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => onCropComplete()}>
                    {t(translationKey.button.close)}
                </Button>
                <Button type="button" onClick={handleCropComplete}>
                    {t(translationKey.button.upload)}
                </Button>
            </div>
        </div>
    );
}

export default ImageCropper;
