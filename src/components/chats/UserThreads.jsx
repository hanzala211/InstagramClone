import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";

export function UserThreads({ isNewChat, item }) {
    const { setIsChatSearch, setSelectedChat, setSearchChatValue, setSearchData } = useChat()
    return <Link to={`/direct/inbox/t/${item._id}/`} onClick={() => {
        setIsChatSearch(false)
        setSelectedChat(item)
        setTimeout(() => {
            setSearchData([])
            setSearchChatValue([])
        }, 400)
    }} className={`flex gap-3 items-center px-5 cursor-pointer ${isNewChat ? "" : "hover:bg-[#262626] hover:bg-opacity-50"} py-2 transition-all duration-300`}>
        <img src={item.profilePic} className="w-14 rounded-full" alt="UserProfile" />
        <div className={`flex flex-col gap-1 ${isNewChat ? "" : "md:block hidden"}`}>
            <h3 className="font-semibold text-[15px]">{item.userName}</h3>
            <p className="text-[13px] text-[#a8a8a8]">{isNewChat ? item.fullName : item.lastMessage}</p>
        </div>
    </Link>
}