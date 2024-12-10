import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function UserThreads({ isNewChat, item }) {
    const { setIsChatSearch, setSelectedChat, setSearchChatValue, setSearchData, notifications } = useChat()
    const { userData } = useUser()
    const [isReceived, setIsReceived] = useState(false);
    const [foundNotification, setFoundNotification] = useState(null)

    useEffect(() => {
        if (notifications.length > 0) {
            setIsReceived(notifications.some((notifi) => {
                return notifi.messageSender === item._id && notifi.read === false;
            }))
            setFoundNotification(notifications.find((notif) => {
                return notif.messageSender === item._id && notif.userId === userData.data.user._id
            }))
        }
    }, [notifications.length])

    function handleUpdateNotification() {
        if (foundNotification !== null) {
            updateDoc(doc(db, "notifications", foundNotification.id), { read: true })
        }
    }

    return <Link to={`/direct/inbox/t/${item._id}/`} onClick={() => {
        setIsChatSearch(false)
        setSelectedChat(item)
        setTimeout(() => {
            setSearchData([])
            setSearchChatValue([])
        }, 400)
        handleUpdateNotification()
        setIsReceived(false)
    }} className={`flex gap-3 items-center px-5 relative cursor-pointer ${isNewChat ? "" : "hover:bg-[#262626] hover:bg-opacity-50"} py-2 transition-all duration-300`}>
        <div className="relative">
            {!isNewChat && isReceived && <div className="absolute md:hidden block right-1 w-2 top-0 h-2 rounded-full bg-[#0096f4]"></div>}
            <img src={item.profilePic} className="w-14 rounded-full" alt="UserProfile" />
        </div>
        <div className={`flex flex-col gap-1 ${isNewChat ? "" : "md:block hidden"}`}>
            <h3 className={`font-semibold text-[15px] ${isReceived ? "font-extrabold" : "font-semibold"}`}>{item.userName}</h3>
            <p className={`text-[13px] text-[#a8a8a8] ${isReceived ? "text-white font-bold" : ""}`}>{isNewChat ? "" : item.lastMessageSender === userData.data.user._id ? "You: " : ""} {isNewChat ? item.fullName : item.lastMessage}</p>
            {!isNewChat && isReceived && <div className="absolute md:block hidden right-5 w-2 top-[47%] -translate-x-1/2 h-2 rounded-full bg-[#0096f4]"></div>}
        </div>
    </Link>
}