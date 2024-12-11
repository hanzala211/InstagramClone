import { useEffect, useState } from "react";
import ReactCropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropUtils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Loader } from "../helpers/Loader";
import { useUser } from "../../context/UserContext";
import { EditPost } from "./EditPost";
import { SelectImage } from "./SelectImage";
import { Overlay } from "../helpers/Overlay";
import { createPost } from "../../services/post";

export function CreatePost({
    isCreating,
    fileInputRef,
    selectedImage,
    setSelectedImage,
    setIsCreating,
    handleFileChange,
    handleFile,
}) {
    const { userData } = useUser();
    const [crop, setCrop] = useState([]);
    const [zoom, setZoom] = useState([]);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [croppedImages, setCroppedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCaption, setIsCaption] = useState(false);
    const [captionValue, setCaptionValue] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);

    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isCreating ? "hidden" : "auto";

        return () => (body.style.overflowY = "auto");
    }, [isCreating]);

    function handleClose() {
        setIsCreating(false);
        setSelectedImage(null);
        setTimeout(() => {
            setIsCaption(false);
            setIsShared(false);
        }, 800);
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreas((prev) => {
            const updatedAreas = [...prev];
            updatedAreas[currentIndex] = croppedAreaPixels;
            return updatedAreas;
        });
    };

    const onCropImage = async () => {
        if (selectedImage && croppedAreas.length) {
            const croppedImageUrls = await getCroppedImg(selectedImage, croppedAreas);
            setCroppedImages(croppedImageUrls);
            setLoading(true);
            setCurrentIndex(0);
            setTimeout(() => {
                setIsCaption(true);
                setLoading(false);
            }, 500);
        }
    };

    return (
        <>
            <Overlay handleClose={handleClose} isPostOpen={isCreating} />
            <div className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isCreating ? "opacity-100" : "pointer-events-none"
                } border-y-[1px] border-[#363636]`}>
                <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2">
                    {!isCaption ? "Create New Post" : !isShared ? "Share" : !shareLoading ? "Post shared" : "Post sharing"}</p>
                {!selectedImage || selectedImage.length === 0 ? (
                    <SelectImage handleFile={handleFile} fileInputRef={fileInputRef} handleFileChange={handleFileChange} />
                ) : (
                    <div
                        className={`bg-[#262626] 1280:w-[70rem] 440:w-[25rem] w-[21rem] h-[70vh] sm:w-[40rem] sm:h-[50vh] md:w-[50rem] lg:w-[60rem] lg:h-[85vh] 2xl:w-[86rem] 2xl:h-[90vh] 1280:h-[88vh] transition-all duration-300 flex flex-col overflow-auto scrollbar-hidden`}
                    >
                        <div className="relative w-full h-full">
                            {!loading && !isCaption ? (
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
                                />
                            ) : isCaption && !isShared ? (
                                <EditPost
                                    croppedImage={croppedImages}
                                    currentIndex={currentIndex}
                                    handleDecrease={() => setCurrentIndex((prev) => prev - 1)}
                                    handleIncrease={() => setCurrentIndex((prev) => prev + 1)}
                                    loading={loading}
                                    isCaption={isCaption}
                                    setCaptionValue={setCaptionValue}
                                    captionValue={captionValue}
                                    userData={userData}
                                />
                            ) : isShared ? (
                                <div
                                    className={`bg-[#262626] w-full h-[65vh] lg:h-[72vh] flex flex-col justify-center items-center`}
                                >
                                    {shareLoading ? (
                                        <img
                                            src="/images/sharedLoader.gif"
                                            alt="loading"
                                            className="w-32"
                                        />
                                    ) : (
                                        <img
                                            src="/images/sharedPost.gif"
                                            alt="loaded"
                                            className="w-32"
                                        />
                                    )}
                                    {shareLoading ? (
                                        ""
                                    ) : (
                                        <p className="text-[20px] font-semibold mt-5">
                                            Your post has been shared.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <Loader />
                            )}
                            {(!selectedImage || selectedImage.length > 1) && !isCaption && (
                                <>
                                    {currentIndex !== selectedImage.length - 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => setCurrentIndex((prev) => prev + 1)}><FaArrowRight className="fill-black" /></button>}
                                    {currentIndex !== 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => setCurrentIndex((prev) => prev - 1)}><FaArrowLeft className="fill-black" /></button>}
                                </>
                            )}
                        </div>
                        {!isCaption && !isShared &&
                            <button className="absolute -top-7 right-0 text-[20px]" onClick={onCropImage}><FaArrowRight /></button>}
                        {!isShared && isCaption && <button className="absolute -top-7 right-0 text-[15px] text-[#0096f4] hover:text-white" onClick={() => createPost(setShareLoading, setIsShared, croppedImages, userData, captionValue, setCaptionValue)}>Share</button>}
                    </div>
                )}
            </div >
        </>
    );
}