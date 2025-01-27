import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { handleSharePost } from "../../services/chat";
import { usePost } from "../../context/PostContext";
import { Post } from "../../types/postType";
import { Notification } from "../../types/chatType";
import { useAuth } from "../../context/AuthContext";

interface UserThreadsProp {
    isNewChat?: boolean;
    item?: any;
    isChat: boolean | undefined;
    handleClose?: (value: void) => void;
}

export const UserThreads: React.FC<UserThreadsProp> = ({ isNewChat, item, isChat, handleClose }) => {
    const { setSelectedChat, notifications, setIsInfoOpen, setIsChatSearch } = useChat()
    const { selectedPost, setIsShareOpen, setIsShareSearch } = usePost()
    const { setMessage } = useUser()
    const { userData } = useAuth()
    const [isReceived, setIsReceived] = useState<boolean>(false);
    const [foundNotification, setFoundNotification] = useState<Notification>();
    const [selectedPostToSend, setSelectedPostToSend] = useState<Post>();
    const navigate = useNavigate()

    useEffect(() => {
        setSelectedPostToSend((): any => {
            const existingPost = { ...selectedPost }
            if (existingPost?.postBy === userData?.data.user._id) {
                existingPost.user = {
                    profilePic: userData?.data.user.profilePic,
                    _id: userData?.data.user._id,
                    userName: userData?.data.user.userName
                }
            }
            return existingPost;
        })
    }, [selectedPost?._id])

    useEffect(() => {
        if (notifications.length > 0) {
            setIsReceived(
                notifications.some(
                    (notifi) => notifi.messageSender === item?._id && notifi.read === false
                )
            );
            const foundNotif = notifications.find(
                (notif) =>
                    notif.messageSender === item?._id &&
                    notif.userId === userData.data.user._id
            );
            setFoundNotification(foundNotif || undefined);
        }
    }, [notifications, item, userData]);

    function handleUpdateNotification() {
        if (foundNotification !== undefined) {
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
            if (handleClose !== undefined) {
                handleClose()
            }
            handleSharePost(userData, item, selectedPostToSend, setMessage, setIsShareOpen, setIsShareSearch)
        }
    }} className={`flex gap-3 items-center px-5 w-full relative cursor-pointer ${isNewChat ? "" : "hover:bg-[#262626] hover:bg-opacity-50"} py-2 transition-all duration-300`}>
        <div className="relative">
            <img src={item?.profilePic} className="w-14 rounded-full" alt="UserProfile" />
        </div>
        <div className={`flex w-[70%] flex-col gap-1 ${isNewChat ? "" : ""}`}>
            <h3 className={`font-semibold text-left text-[15px] ${isReceived ? "font-extrabold" : "font-semibold"}`}>{item?.userName}</h3>
            <p className={`text-[13px] line-clamp-1 text-left text-[#a8a8a8] ${isReceived ? "text-white font-bold" : ""}`}>
                {isNewChat ? "" : item?.lastMessageSender === userData?.data?.user?._id ? "You: " : ""} {isNewChat ? item?.fullName : item?.lastMessageSender !== userData?.data?.user?._id && item?.lastMessage === "Sent an attachement" ? item?.fullName + " " + item?.lastMessage : item?.lastMessage}
            </p>
            {!isNewChat && isReceived &&
                <div className="absolute right-5 w-2 top-[47%] -translate-x-1/2 h-2 rounded-full bg-[#0096f4]"></div>
            }
        </div>
    </button>
}