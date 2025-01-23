import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Loader } from "../helpers/Loader";
import { useUser } from "../../context/UserContext";
import { EditPost } from "./EditPost";
import { SelectImage } from "./SelectImage";
import { Overlay } from "../helpers/Overlay";
import { handleFile, handleFileChange, onCropImage } from "../../utils/helper";
import { usePost } from "../../context/PostContext";
import { useNavigate } from "react-router-dom";
import { PostCropper } from "./PostCropper";
import { PostSliderButtons } from "./PostSliderButtons";
import { useAuth } from "../../context/AuthContext";

interface CreatePostProps {
    isCreating: boolean;
    setIsCreating: (value: boolean) => void
}

export const CreatePost: React.FC<CreatePostProps> = ({ isCreating, setIsCreating }) => {
    const { fileInputRef, selectedImage, setSelectedImage, croppedAreas, setCroppedAreas, setCroppedImages, croppedImages, currentIndex, setCurrentIndex, loading, setLoading, isCaption, setIsCaption, isShared, setIsShared, shareLoading, createPosts } = usePost();
    const { innerWidth } = useUser();
    const { userData } = useAuth()
    const navigate = useNavigate();

    useEffect((): any => {
        const body: any = document.querySelector("body");
        body.style.overflowY = isCreating ? "hidden" : "auto";

        return () => (body.style.overflowY = "auto");
    }, [isCreating]);

    const handleClose = () => {
        setIsCreating(false);
        setSelectedImage(null);
        setTimeout(() => {
            setIsCaption(false);
            setIsShared(false);
        }, 800);
    };

    function handleIncrease() {
        setCurrentIndex((prev) => prev + 1)
    }

    function handleDecrease() {
        setCurrentIndex((prev) => prev - 1)
    }

    return (
        <>
            <Overlay handleClose={handleClose} isPostOpen={isCreating} />
            <div
                className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isCreating ? "opacity-100" : "pointer-events-none"} border-y-[1px] border-[#363636]`}
            >
                <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2">
                    {!isCaption
                        ? "Create New Post"
                        : !isShared
                            ? "Share"
                            : !shareLoading
                                ? "Post shared"
                                : "Post sharing"}
                </p>

                {!selectedImage || selectedImage.length === 0 ? (
                    <SelectImage
                        handleFile={() => handleFile(fileInputRef)}
                        fileInputRef={fileInputRef}
                        handleFileChange={(e: any) =>
                            handleFileChange(e, setSelectedImage, innerWidth, navigate)
                        }
                    />
                ) : (
                    <div
                        className={`bg-[#262626] ${isShared
                            ? "md:w-[40rem] md:h-[40rem] w-[23rem] h-[32rem] 440:w-[25rem] 440:h-[35rem]"
                            : "1280:w-[70rem] 440:w-[25rem] w-[22rem] h-[70vh] sm:w-[40rem] sm:h-[50vh] md:w-[50rem] lg:w-[60rem] lg:h-[85vh] 2xl:w-[86rem] 2xl:h-[88vh] 1280:h-[88vh]"
                            } transition-all duration-300 flex flex-col overflow-auto scrollbar-hidden`}
                    >
                        <div className="relative w-full h-full">
                            {!loading && !isCaption ? (
                                <PostCropper
                                    currentIndex={currentIndex}
                                    setCroppedAreas={setCroppedAreas}
                                />
                            ) : isCaption && !isShared ? (
                                <EditPost
                                    croppedImage={croppedImages}
                                    handleDecrease={() => setCurrentIndex((prev) => prev - 1)}
                                    handleIncrease={() => setCurrentIndex((prev) => prev + 1)} />
                            ) : isShared ? (
                                <div className="bg-[#262626] w-full h-[60vh] flex flex-col justify-center items-center">
                                    {shareLoading ? (
                                        <img src="/images/sharedLoader.gif"
                                            alt="loading"
                                            className="w-32" />
                                    ) : (
                                        <img src="/images/sharedPost.gif"
                                            alt="loaded"
                                            className="w-32" />
                                    )}
                                    {!shareLoading && (
                                        <p className="text-[20px] font-semibold mt-5">
                                            Your post has been shared.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <Loader />
                            )}

                            <PostSliderButtons posts={selectedImage} currentPost={currentIndex} handleDecrease={handleDecrease} handleIncrease={handleIncrease} isPostSlider={true} isCaption={isCaption} isHome={true} />

                        </div>

                        {!isCaption && !isShared && (
                            <button
                                className="absolute -top-7 right-0 text-[20px]"
                                onClick={() => onCropImage(selectedImage, croppedAreas, setCroppedImages, setLoading, setCurrentIndex, setIsCaption)}>
                                <FaArrowRight />
                            </button>
                        )}

                        {!isShared && isCaption && (
                            <button className="absolute -top-7 right-0 text-[15px] text-[#0096f4] hover:text-white" onClick={() => createPosts(false)}>
                                Share
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
