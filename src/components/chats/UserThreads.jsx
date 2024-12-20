import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { handleSharePost } from "../../services/chat";
import { usePost } from "../../context/PostContext";

export function UserThreads({ isNewChat, item, isChat, handleClose }) {
    const { setSelectedChat, notifications, setIsInfoOpen, setIsChatSearch } = useChat()
    const { selectedPost, setIsShareOpen, setIsShareSearch } = usePost()
    const { userData, setMessage } = useUser()
    const [isReceived, setIsReceived] = useState(false);
    const [foundNotification, setFoundNotification] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (notifications.length > 0) {
            setIsReceived(notifications.some((notifi) => {
                return notifi.messageSender === item?._id && notifi.read === false;
            }))
            setFoundNotification(notifications.find((notif) => {
                return notif.messageSender === item?._id && notif.userId === userData.data.user._id
            }))
        }
    }, [notifications.length])

    function handleUpdateNotification() {
        if (foundNotification !== null) {
            updateDoc(doc(db, "notifications", foundNotification.id), { read: true })
        }
    }

    return <button onClick={() => {
        if (isChat) {
            navigate(`/direct/inbox/t/${item?._id}`)
            setSelectedChat(item)
            handleUpdateNotification()
            setIsReceived(false)
            setIsInfoOpen(false)
            setIsChatSearch(false)
        } else {
            handleClose()
            handleSharePost(userData, item, selectedPost, setMessage, setIsShareOpen, setIsShareSearch)
        }
    }} className={`flex gap-3 items-center px-5 w-full relative cursor-pointer ${isNewChat ? "" : "hover:bg-[#262626] hover:bg-opacity-50"} py-2 transition-all duration-300`}>
        <div className="relative">
            <img src={item?.profilePic} className="w-14 rounded-full" alt="UserProfile" />
        </div>
        <div className={`flex w-[70%] flex-col gap-1 ${isNewChat ? "" : ""}`}>
            <h3 className={`font-semibold text-left text-[15px] ${isReceived ? "font-extrabold" : "font-semibold"}`}>{item?.userName}</h3>
            <p className={`text-[13px] line-clamp-1 text-left text-[#a8a8a8] ${isReceived ? "text-white font-bold" : ""}`}>{isNewChat ? "" : item?.lastMessageSender === userData?.data?.user?._id ? "You: " : ""} {isNewChat ? item?.fullName : item?.lastMessageSender !== userData?.data?.user?._id && item?.lastMessage === "Sent an attachement" ? item?.fullName + " " + item?.lastMessage : item?.lastMessage}</p>
            {!isNewChat && isReceived && <div className="absolute right-5 w-2 top-[47%] -translate-x-1/2 h-2 rounded-full bg-[#0096f4]"></div>}
        </div>
    </button>
}