import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../context/PostContext";

export function PostPageHeader() {
    const { setSelectedPost, setComments } = usePost()
    const navigate = useNavigate()
    return <div className="fixed top-0 bg-[#000] flex md:hidden py-5 items-center border-b-[2px] border-[#363636] w-full h-[2rem]">
        <FaChevronLeft onClick={() => {
            navigate(-1)
            setSelectedPost(null)
            setComments([])
        }} className="text-[20px] ml-3" />
        <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[18px]">Post</p>
    </div>
}