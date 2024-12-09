import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../context/PostContext";
import { ChatIcon } from "../../assets/Constants";

export function PostPageHeader({ isArrowNeeded, isHomePage, isInbox }) {
    const { setSelectedPost, setComments } = usePost()
    const navigate = useNavigate()
    return <div className="fixed top-0 z-[1000] bg-[#000] flex md:hidden py-5 items-center border-b-[2px] border-[#363636] w-full h-[2rem]">
        {isArrowNeeded && <FaChevronLeft onClick={() => {
            navigate(-1)
            setSelectedPost(null)
            setComments([])
        }} className="text-[20px] ml-3" />
        }
        {!isHomePage ?
            <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[18px]">{isInbox ? "Inbox" : "Post"}</p> : <img src="/images/instagramiconswhite.png" className="w-24 absolute left-1/2 -translate-x-1/2 mt-1.5" />
        }
        {isHomePage ? <Link to="/direct/inbox/" className="absolute right-2"><ChatIcon /></Link> : ""}
    </div>
}