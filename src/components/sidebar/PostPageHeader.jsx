import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../context/PostContext";
import { ActiveChatInfoSVG, ChatIcon, ChatInfoSVG, ChatSearchIcon } from "../../assets/Constants";
import { useChat } from "../../context/ChatContext";
import { useSearch, useUser } from "../../context/UserContext";
import { fetchUserDataOnClick } from "../../services/searchProfile";

export function PostPageHeader({ isArrowNeeded, isHomePage, isInbox, isChat, isChatting }) {
    const { setSelectedPost, setComments } = usePost()
    const { setSelectedProfile } = useSearch()
    const { userData, setMainLoading } = useUser()
    const { notifications, selectedChat, setIsChatSearch, isInfoOpen, setIsInfoOpen } = useChat()
    const navigate = useNavigate()

    return <div className={`fixed py-5 z-[10] top-0 bg-[#000] flex md:hidden items-center ${isChat && !isChatting ? "" : " border-b-[2px] border-[#111111]"} w-full h-[2rem]`}>
        {isArrowNeeded && <FaChevronLeft onClick={() => {
            navigate(isChatting ? "/direct/inbox/" : isChat ? "/home" : -1)
            setTimeout(() => {
                setSelectedPost(null)
            }, 400)
            setComments([])
            setIsInfoOpen(false)
        }} className="text-[20px] ml-3" />}
        {isChatting && <>
            <img src={selectedChat?.profilePic} className="w-6 ml-3 rounded-full" alt={selectedChat?.userName} />
            <Link to={`/search/${selectedChat?.userName}/`} onClick={() => {
                fetchUserDataOnClick(selectedChat?.userName, userData, null, setSelectedProfile, setMainLoading)
                setMainLoading(true)
            }} className="font-bold ml-3 text-[13px]">
                {selectedChat?.fullName}
            </Link>
            <button className="absolute right-2" onClick={() => setIsInfoOpen((prev) => !prev)}>{isInfoOpen ? <ActiveChatInfoSVG /> : <ChatInfoSVG />}</button>
        </>}
        {!isHomePage ?
            <p className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[18px] font-semibold ${isChatting ? "hidden" : ""}`}>{isInbox ? "Inbox" : isChat ? userData?.data?.user.userName : "Post"}</p> : <img src="/images/instagramiconswhite.png" className="w-24 absolute left-1/2 -translate-x-1/2 mt-1.5" />
        }
        {isHomePage ? <Link to="/direct/inbox/" className="relative left-[92%]">
            {notifications.length > 0 && <div className="absolute w-4 h-4 border-[1px] border-black text-white bg-red-600 rounded-full text-[10px] text-center -right-1 -top-1">{notifications.length}</div>}<ChatIcon /></Link> : ""}
        {isChat && !isChatting && <button onClick={() => setIsChatSearch(true)} className="relative left-[82%] hover:opacity-70 transition duration-200"><ChatSearchIcon /></button>}
    </div>
}