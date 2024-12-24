import ReactCropper from "react-easy-crop";
import { usePost } from "../../context/PostContext";
import { useState } from "react";

export function PostCropper({ currentIndex, setCroppedAreas, isMobile }) {
    const [crop, setCrop] = useState([]);
    const [zoom, setZoom] = useState([]);
    const { selectedImage } = usePost()

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreas((prev) => {
            const updatedAreas = [...prev];
            updatedAreas[currentIndex] = croppedAreaPixels;
            return updatedAreas;
        });
    };

    return <div className={`h-full relative w-full ${isMobile ? "fixed-height" : ""}`}>
        <ReactCropper
            image={selectedImage[currentIndex]}
            crop={crop[currentIndex] || { x: 0, y: 0 }}
            zoom={zoom[currentIndex] || 1}
            aspect={1}
            onCropChange={(newCrop) =>
                setCrop((prev) => {
                    const updatedCrop = [...prev];
                    updatedCrop[currentIndex] = newCrop;
                    return updatedCrop;
                })
            }
            onZoomChange={(newZoom) =>
                setZoom((prev) => {
                    const updatedZoom = [...prev];
                    updatedZoom[currentIndex] = newZoom;
                    return updatedZoom;
                })
            }
            onCropComplete={onCropComplete}
            className="cropper-image"
        />
    </div>
}