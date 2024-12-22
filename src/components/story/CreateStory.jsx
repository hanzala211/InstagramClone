import Pintura from "../helpers/Pintura";
import { Overlay } from "../helpers/Overlay";
import { SelectImage } from "../post/SelectImage";
import { handleClickForStory, handleFileChangeForStories } from "../../utils/helper";
import { useStories } from "../../context/StoriesContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export function CreateStory({ creatingStory, setIsCreatingStory }) {
    const { fileInputRef, selectedImage, setSelectedImage, result, setResult, isUploading, setIsUploading, uploaded, setUploaded } = useStories()
    const { innerWidth } = useUser()
    const navigate = useNavigate()

    function handleClose() {
        setIsCreatingStory(false);
        setTimeout(() => {
            setIsUploading(false)
            setUploaded(false)
            setSelectedImage(null)
            setResult(null);
        }, 500)
    }

    return <>
        <Overlay handleClose={handleClose} isPostOpen={creatingStory} />
        <div
            className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${creatingStory ? "opacity-100" : "pointer-events-none"} border-y-[1px] border-[#363636] 
        lg:block h-[70vh] md:w-[50rem] 440:w-[26rem] w-[23rem]`}>
            <p className="text-[18px] absolute -top-9 left-1/2 -translate-x-1/2 sm:text-[16px] md:text-[18px]">
                {!isUploading ? "Create New Story" : !uploaded ? "Story Sharing" : "Story Shared"}
            </p>

            <div className="bg-[#262626] flex items-center justify-center flex-col gap-2 w-full h-full px-5 py-5">
                {selectedImage === null ? (
                    <SelectImage handleFile={() => handleClickForStory(fileInputRef)} fileInputRef={fileInputRef} handleFileChange={(e) => handleFileChangeForStories(e, setSelectedImage, fileInputRef, innerWidth, navigate)} />
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