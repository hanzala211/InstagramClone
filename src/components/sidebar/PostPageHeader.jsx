import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../context/PostContext";
import { ChatIcon, ChatSearchIcon } from "../../assets/Constants";
import { useChat } from "../../context/ChatContext";
import { useSearch, useUser } from "../../context/UserContext";
import { fetchUserDataOnClick } from "../../services/searchProfile";

export function PostPageHeader({ isArrowNeeded, isHomePage, isInbox, isChat, isChatting }) {
    const { setSelectedPost, setComments } = usePost()
    const { setSelectedProfile } = useSearch()
    const { userData, setMainLoading } = useUser()
    const { notifications, selectedChat, setIsChatSearch } = useChat()
    const navigate = useNavigate()

    return <div className={`fixed py-5 z-[1000] top-0 bg-[#000] flex md:hidden items-center ${isChat && !isChatting ? "" : " border-b-[2px] border-[#111111]"} w-full h-[2rem]`}>
        {isArrowNeeded && <FaChevronLeft onClick={() => {
            navigate(isChatting ? "/direct/inbox/" : -1)
            setSelectedPost(null)
            setComments([])
        }} className="text-[20px] ml-3" />}
        {isChatting && <>
            <img src={selectedChat?.profilePic} className="w-6 ml-3 rounded-full" alt={selectedChat?.userName} />
            <Link to={`/search/${selectedChat?.userName}/`} onClick={() => {
                fetchUserDataOnClick(selectedChat?.userName, userData, null, setSelectedProfile, setMainLoading)
                setMainLoading(true)
            }} className="font-bold ml-3 text-[13px]">
                {selectedChat?.fullName}
            </Link>
        </>}
        {!isHomePage ?
            <p className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[18px] font-semibold ${isChatting ? "hidden" : ""}`}>{isInbox ? "Inbox" : isChat ? userData?.data?.user.userName : "Post"}</p> : <img src="/images/instagramiconswhite.png" className="w-24 absolute left-1/2 -translate-x-1/2 mt-1.5" />
        }
        {isHomePage ? <Link to="/direct/inbox/" className="relative left-[93%]">
            {notifications.length > 0 && <div className="absolute w-4 h-4 border-[1px] border-black text-white bg-red-600 rounded-full text-[10px] text-center -right-1 -top-1">{notifications.length}</div>}<ChatIcon /></Link> : ""}
        {isChat && !isChatting && <button onClick={() => setIsChatSearch(true)} className="relative left-[85%] hover:opacity-70 transition duration-200"><ChatSearchIcon /></button>}
    </div>
}