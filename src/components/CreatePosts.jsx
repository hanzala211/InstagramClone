import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CreatePosts } from "../assets/Constants";
import ReactCropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropUtils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Loader } from "../components/Loader";
import { useUser } from "../context/UserContext";
import { EditPost } from "./EditPost";

export function CreatePost({ isCreating, fileInputRef, selectedImage, setSelectedImage, setIsCreating, handleFileChange, handleFile }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCaption, setIsCaption] = useState(false);
    const [captionValue, setCaptionValue] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const { userData } = useUser();
    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isCreating ? "hidden" : "auto";

        return () => body.style.overflowY = "auto"
    }, [isCreating])

    function handleClose() {
        setIsCreating(false);
        setSelectedImage(null);
        setTimeout(() => {
            setIsCaption(false);
            setIsShared(false);
        }, 800)
    }
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const onCropImage = async () => {
        if (selectedImage && croppedAreaPixels) {
            const croppedImageUrl = await getCroppedImg(
                selectedImage,
                croppedAreaPixels
            );
            setCroppedImage(croppedImageUrl);
            setLoading(true);
            setCurrentIndex(0);
            setTimeout(() => {
                setIsCaption(true);
                setLoading(false);
            }, 500)
        }
    };
    function handleIncrease() {
        setCurrentIndex((prev) => prev + 1)
    }
    function handleDecrease() {
        setCurrentIndex((prev) => prev - 1)
    }
    async function createPost() {
        const formData = new FormData();
        try {
            setShareLoading(true);
            setIsDisabled(true);
            setIsShared(true);
            await Promise.all(croppedImage.map(async (item, index) => {
                const response = await fetch(item);
                const blob = await response.blob();
                formData.append("images", blob, `image${index}.jpg`);
            }));
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                },
                body: formData,
                redirect: "follow"
            })
            const result = await response.json();
            if (captionValue.length > 0) {
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/caption/${result.post._id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `${userData.data.token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "caption": captionValue
                    }),
                    redirect: "follow"
                })
                const captionResult = await response.json();
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false);
            setShareLoading(false)
            setCaptionValue("")
        }
    }
    return (
        <>
            <IoCloseSharp
                className={`fixed text-[35px] top-8 right-9 z-[100000] cursor-pointer opacity-0 ${isCreating ? "opacity-100" : "pointer-events-none"}`}
                onClick={() => handleClose()}
            />
            <div
                className={`overlay opacity-0 transition-all z-[50] duration-500 ${!isCreating ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                    }`}
                onClick={() => handleClose()}
            ></div>

            <div
                className={`fixed opacity-0 top-[51%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isCreating ? "opacity-100" : "pointer-events-none"
                    } border-y-[1px] border-[#363636]`}
            >
                <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2">
                    {!isCaption ? "Create New Post" : !isShared ? "Share" : !shareLoading ? "Post shared" : "Post sharing"}
                </p>
                {!selectedImage || selectedImage.length === 0 ? (
                    <div className="bg-[#262626] px-10 py-10 w-[36vw] h-[72vh] flex items-center justify-center flex-col gap-2">
                        <CreatePosts />
                        <p className="text-[20px]">Drag photos and videos here</p>
                        <button
                            onClick={handleFile}
                            className="bg-[#0095F6] hover:bg-opacity-70 transition-all duration-200 px-3 py-2 text-[14px] rounded-lg"
                        >
                            Select From Computer
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            multiple={true}
                        />
                    </div>
                ) : (
                    <div className={`bg-[#262626] w-[36vw] h-[72vh] transition-all duration-300 flex flex-col ${isCaption && !isShared ? "w-[55vw]" : ""}`}>
                        <div className="relative w-full h-full">
                            {!loading && !isCaption ? <ReactCropper
                                image={selectedImage[currentIndex]}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            /> : isCaption && !isShared ? <EditPost croppedImage={croppedImage} currentIndex={currentIndex} handleDecrease={handleDecrease} handleIncrease={handleIncrease} loading={loading} isCaption={isCaption} setCaptionValue={setCaptionValue} captionValue={captionValue} userData={userData} /> : isShared ? <div className={`bg-[#262626] w-full h-[72vh] flex flex-col justify-center items-center`}>
                                {shareLoading ? <img src="/images/sharedLoader.gif" alt="loading" className="w-32" /> : <img src="/images/sharedPost.gif" alt="loaded" className="w-32" />}
                                {shareLoading ? "" : <p className="text-[20px] font-semibold mt-5">Your post has been shared.</p>}
                            </div> : <Loader />}
                            {(!selectedImage || selectedImage.length > 1) && !loading && !isCaption ?
                                <>
                                    {currentIndex !== selectedImage.length - 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleIncrease}><FaArrowRight className="fill-black" /></button>}
                                    {currentIndex !== 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleDecrease}><FaArrowLeft className="fill-black" /></button>}
                                </> : ""}
                        </div>
                        {!isCaption ? <button
                            onClick={onCropImage}
                            className="mt-4 absolute -right-2 -top-14  duration-200 px-3 py-2 text-[20px] rounded-lg"
                        >
                            <FaArrowRight />
                        </button> : !isShared ? <button
                            className="mt-4 absolute text-[#0095F6] hover:text-white -right-2 -top-14  duration-200 px-3 py-2 text-[15px] font-semibold rounded-lg"
                            onClick={createPost}
                            disabled={isDisabled}
                        >
                            Share
                        </button> : ""}
                    </div>
                )}
            </div>
        </>
    );
}
