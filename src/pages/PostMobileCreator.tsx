import { PageHeader } from "../components/sidebar/PageHeader"
import { PostCropper } from "../components/post/PostCropper"
import { usePost } from "../context/PostContext"

export const MobilePostCreator: React.FC = () => {
    const { selectedImage, setCroppedAreas, currentIndex, setCurrentIndex } = usePost()

    return <section>
        <PageHeader isCross={true} />
        <div className="h-[435px]">
            <PostCropper currentIndex={currentIndex} isMobile={true} setCroppedAreas={setCroppedAreas} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 mx-1 scrollbar-hidden">
            {selectedImage !== null && selectedImage.map((item, index) => (
                <img onClick={() => {
                    setCurrentIndex(index)
                }} src={item} key={index} className="w-32 h-28 rounded-lg" alt="post images" />
            ))}
        </div>
    </section>
}