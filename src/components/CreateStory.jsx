import { IoCloseSharp } from "react-icons/io5";
import { CreatePosts } from "../assets/Constants";
import { useRef, useState } from "react";
import Pintura from "./Pintura";
import { useUser } from "../context/UserContext";

export function CreateStory({ creatingStory, setIsCreatingStory }) {
    const { userData } = useUser();
    const [selectedImage, setSelectedImage] = useState(null)
    const [result, setResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const fileInputRef = useRef(null)

    function handleClose() {
        setIsCreatingStory(false);
        setTimeout(() => {
            setIsUploading(false)
            setUploaded(false)
            setSelectedImage(null)
            setResult(null);
        }, 500)
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(URL.createObjectURL(file));
        }
        fileInputRef.current.value = null;
    }

    function handleFile() {
        fileInputRef.current.click();
    }

    async function uploadStory() {
        const formdata = new FormData();
        const blobImage = await fetch(result).then((req) => req.blob())
        formdata.append("image", blobImage, "storyImage.jpg")
        try {
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/story`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                body: formdata,
                redirect: "follow"
            })
            const resultAwait = await response.json();
        } catch (error) {
            console.error(error)
        } finally {
            setUploaded(true);
        }
    }

    return <>
        <IoCloseSharp
            className={`fixed text-[35px] top-8 right-9 z-[100000] cursor-pointer opacity-0 ${creatingStory ? "opacity-100" : "pointer-events-none"}`}
            onClick={() => handleClose()}
        />
        <div
            className={`overlay opacity-0 z-[50] transition-all duration-500 ${!creatingStory ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div
            className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${creatingStory ? "opacity-100" : "pointer-events-none"} border-y-[1px] border-[#363636] 
        lg:block xl:w-[40vw] h-[72vh] sm:w-[60vw] `}
        >
            <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2 sm:text-[16px] md:text-[18px]">
                {!isUploading ? "Create New Story" : !uploaded ? "Story Sharing" : "Story Shared"}
            </p>

            <div className="bg-[#262626] flex items-center justify-center flex-col gap-2 w-full h-full px-5 py-5">
                {selectedImage === null ? (
                    <>
                        <CreatePosts />
                        <p className="text-[20px] sm:text-[18px]">Drag photos and videos here</p>
                        <button
                            onClick={handleFile}
                            className="bg-[#0095F6] hover:bg-opacity-70 transition-all duration-200 px-3 py-2 text-[14px] rounded-lg sm:px-2 sm:py-1 sm:text-[12px]"
                        >
                            Select From Computer
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </>
                ) : !isUploading ? (
                    <Pintura
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        setResult={setResult}
                        result={result}
                        uploadStory={uploadStory}
                        setIsUploading={setIsUploading}
                    />
                ) : (
                    <>
                        {!uploaded ? (
                            <img src="/images/sharedLoader.gif" alt="loading" className="w-32 sm:w-24" />
                        ) : (
                            <img src="/images/sharedPost.gif" alt="loaded" className="w-32 sm:w-24" />
                        )}
                        {!uploaded ? "" : <p className="text-[20px] font-semibold mt-5 sm:text-[18px]">Your story has been shared.</p>}
                    </>
                )}
            </div>
        </div>


    </>
}