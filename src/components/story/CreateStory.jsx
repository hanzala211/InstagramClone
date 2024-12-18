import { CreatePosts } from "../../assets/Constants";
import { useRef, useState } from "react";
import Pintura from "../helpers/Pintura";
import { Overlay } from "../helpers/Overlay";
import { SelectImage } from "../post/SelectImage";

export function CreateStory({ creatingStory, setIsCreatingStory }) {
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

    return <>
        <Overlay handleClose={handleClose} isPostOpen={creatingStory} />
        <div
            className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${creatingStory ? "opacity-100" : "pointer-events-none"} border-y-[1px] border-[#363636] 
        lg:block xl:w-[40vw] h-[70vh] sm:w-[30rem] 440:w-[26rem] w-[23rem] `}
        >
            <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2 sm:text-[16px] md:text-[18px]">
                {!isUploading ? "Create New Story" : !uploaded ? "Story Sharing" : "Story Shared"}
            </p>

            <div className="bg-[#262626] flex items-center justify-center flex-col gap-2 w-full h-full px-5 py-5">
                {selectedImage === null ? (
                    <SelectImage handleFile={handleFile} fileInputRef={fileInputRef} handleFileChange={handleFileChange} />
                ) : !isUploading ? (
                    <Pintura
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        setResult={setResult}
                        result={result}
                        setIsUploading={setIsUploading}
                        setUploaded={setUploaded}
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