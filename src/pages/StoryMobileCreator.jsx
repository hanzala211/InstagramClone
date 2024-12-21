import { IoCloseSharp } from "react-icons/io5"
import Pintura from "../components/helpers/Pintura"
import { useStories } from "../context/StoriesContext"
import { useNavigate } from "react-router-dom"

export function StoryMobileCreator() {
    const { selectedImage, setSelectedImage, setUploaded, setIsUploading, isUploading, setResult, result } = useStories()
    const navigate = useNavigate()

    return <section className="relative">
        <IoCloseSharp className="absolute z-10 text-[30px] top-3 left-3" onClick={() => {
            setSelectedImage(null)
            navigate("/home")
        }} />
        {isUploading && <h2 className="absolute z-20 left-1/2 -translate-x-1/2 top-3 font-semibold text-[17px]">Uploading...</h2>}
        <Pintura selectedImage={selectedImage} result={result} setResult={setResult} setIsUploading={setIsUploading} setUploaded={setUploaded} />
    </section>
}