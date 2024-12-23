import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Loader } from "../helpers/Loader";
import { useUser } from "../../context/UserContext";
import { EditPost } from "./EditPost";
import { SelectImage } from "./SelectImage";
import { Overlay } from "../helpers/Overlay";
import { createPost } from "../../services/post";
import { handleFile, handleFileChange, onCropImage } from "../../utils/helper";
import { usePost } from "../../context/PostContext";
import { useNavigate } from "react-router-dom";
import { PostCropper } from "./PostCropper";

export function CreatePost({ isCreating, setIsCreating }) {
    const { fileInputRef, selectedImage, setSelectedImage, croppedAreas, setCroppedAreas, setCroppedImages, croppedImages, currentIndex, setCurrentIndex, loading, setLoading, isCaption, setIsCaption, captionValue, setCaptionValue, isShared, setIsShared, shareLoading, setShareLoading } = usePost()
    const { userData, innerWidth } = useUser();
    const navigate = useNavigate()

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

    return (
        <>
            <Overlay handleClose={handleClose} isPostOpen={isCreating} />
            <div className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isCreating ? "opacity-100" : "pointer-events-none"
                } border-y-[1px] border-[#363636]`}>
                <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2">
                    {!isCaption ? "Create New Post" : !isShared ? "Share" : !shareLoading ? "Post shared" : "Post sharing"}</p>
                {!selectedImage || selectedImage.length === 0 ? (
                    <SelectImage handleFile={() => handleFile(fileInputRef)} fileInputRef={fileInputRef} handleFileChange={(e) => handleFileChange(e, setSelectedImage, innerWidth, navigate)} />
                ) : (
                    <div
                        className={`bg-[#262626] ${isShared ? "md:w-[40rem] md:h-[40rem] w-[23rem] h-[32rem] 440:w-[25rem] 440:h-[35rem]" : "1280:w-[70rem] 440:w-[25rem] w-[22rem] h-[70vh] sm:w-[40rem] sm:h-[50vh] md:w-[50rem] lg:w-[60rem] lg:h-[85vh] 2xl:w-[86rem] 2xl:h-[90vh] 1280:h-[88vh]"}  transition-all duration-300 flex flex-col overflow-auto scrollbar-hidden`}>
                        <div className="relative w-full h-full">
                            {!loading && !isCaption ? (
                                <PostCropper currentIndex={currentIndex} setCroppedAreas={setCroppedAreas} />
                            ) : isCaption && !isShared ? (
                                <EditPost isCaption={isCaption} croppedImage={croppedImages}
                                    handleDecrease={() => setCurrentIndex((prev) => prev - 1)}
                                    handleIncrease={() => setCurrentIndex((prev) => prev + 1)}
                                    userData={userData} />
                            ) : isShared ? (
                                <div
                                    className={`bg-[#262626] w-full h-[60vh] flex flex-col justify-center items-center`}
                                >
                                    {shareLoading ? (
                                        <img src="/images/sharedLoader.gif" alt="loading" className="w-32" />) : (<img src="/images/sharedPost.gif" alt="loaded" className="w-32" />)}
                                    {shareLoading ? "" : (<p className="text-[20px] font-semibold mt-5">Your post has been shared.</p>)}
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
                            <button className="absolute -top-7 right-0 text-[20px]" onClick={() => onCropImage(selectedImage, croppedAreas, setCroppedImages, setLoading, setCurrentIndex, setIsCaption)}><FaArrowRight /></button>}
                        {!isShared && isCaption && <button className="absolute -top-7 right-0 text-[15px] text-[#0096f4] hover:text-white" onClick={() => createPost(setShareLoading, setIsShared, croppedImages, userData, captionValue, setCaptionValue, false, navigate)}>Share</button>}
                    </div>
                )}
            </div >
        </>
    );
}