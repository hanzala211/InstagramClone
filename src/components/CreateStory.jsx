import { IoCloseSharp } from "react-icons/io5";
import { CreatePosts } from "../assets/Constants";
import { useRef, useState } from "react";
import Pintura from "./Pintura";
import { useUser } from "../context/UserContext";

export function CreateStory({ creatingStory, setIsCreatingStory }) {
    const [selectedImage, setSelectedImage] = useState(null)
    const fileInputRef = useRef(null)
    const [result, setResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const { userData } = useUser();
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
            console.log(resultAwait)
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
            className={`overlay opacity-0 transition-all duration-500 ${!creatingStory ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={() => handleClose()}
        ></div>
        <div
            className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${creatingStory ? "opacity-100" : "pointer-events-none"
                } border-y-[1px] border-[#363636]`}
        >
            <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2">
                {!isUploading ? "Create New Story" : !uploaded ? "Story Sharing" : "Story Shared"}
            </p>
            {selectedImage === null ? <div className="bg-[#262626] px-10 py-10 w-[36vw] h-[72vh] flex items-center justify-center flex-col gap-2">
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
                />
            </div> : !isUploading ? <div className="bg-[#262626] w-[36vw] h-[72vh] flex items-center justify-center flex-col gap-2"><Pintura selectedImage={selectedImage} setSelectedImage={setSelectedImage} setResult={setResult} result={result} uploadStory={uploadStory} setIsUploading={setIsUploading} /></div> : <div className="bg-[#262626] w-[36vw] h-[72vh] flex items-center justify-center flex-col gap-2">
                {!uploaded ? <img src="/images/sharedLoader.gif" alt="loading" className="w-32" /> : <img src="/images/sharedPost.gif" alt="loaded" className="w-32" />}
                {!uploaded ? "" : <p className="text-[20px] font-semibold mt-5">Your story has been shared.</p>}
            </div>}
        </div >
    </>
}