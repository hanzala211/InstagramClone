import { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "./UserContext"
import { useLocation } from "react-router-dom"
import { fetchSelectedChat, fetchUserById } from "../services/chat"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { ChatContextType } from "../types/contextTypes"
import { ContextChild } from "../types/contextTypes"
import { UserData, UserInfo } from "../types/user"
import { Messages, Notification, Thread } from "../types/chatType"


const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<ContextChild> = ({ children }) => {
    const { userData } = useUser();
    const [isChatSearch, setIsChatSearch] = useState<boolean>(false)
    const [selectedChat, setSelectedChat] = useState<UserData | UserInfo | null>(null)
    const [searchData, setSearchData] = useState<UserInfo[]>([])
    const [searchChatValue, setSearchChatValue] = useState<string>("")
    const [messages, setMessages] = useState<Messages[]>([])
    const [threads, setThreads] = useState<Thread[] | []>([])
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [messagesLoading, setMessagesLoading] = useState<boolean>(false)
    const [threadsLoading, setThreadsLoading] = useState<boolean>(false)
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.slice(16, -1) !== "" && selectedChat === null && location.pathname.slice(0, 7) === '/direct') {
            fetchSelectedChat(userData, setSelectedChat, location)
        }
    }, [location.pathname, selectedChat, userData])

    useEffect(() => {
        if (userData && selectedChat) {
            setMessages([])
            setMessagesLoading(true)
            const querySearch = query(collection(db, "messagesThread", [userData?.data?.user._id, selectedChat?._id].sort().join("_"), "messages"), orderBy("timeStamp"))
            const unsubscribe = onSnapshot(querySearch, (querySnapShote) => {
                setMessages(querySnapShote.docs
                    .map((item) => ({
                        ...item.data(),
                        id: item.id
                    }))
                    .filter((item) => {
                        const deleted = item?.deleted || {};
                        return !(deleted[userData.data.user._id]);
                    }))
                setMessagesLoading(false)
            })
            return () => unsubscribe()
        }
    }, [selectedChat, userData])

    useEffect(() => {
        if (!userData?.data?.user?._id) return;
        setThreadsLoading(true)
        const querySearch = query(
            collection(db, "messagesThread"),
            where("participants", "array-contains", userData.data.user._id));
        const unsubscribe = onSnapshot(querySearch, (querySnapshot) => {
            const foundArr = querySnapshot.docs
                .map((item) => item.data())
                .filter((thread) => {
                    const deleted = thread.deleted || {};
                    return deleted[userData.data.user._id] !== true;
                })
            const foundIds = foundArr.map((item) => item.participants.find((id: string) => userData.data.user._id !== id))
            if (foundIds.length > 0) {
                Promise.all(foundIds.map((item, index) => fetchUserById(item, index, userData, foundArr))).then((res) => {
                    setThreads(res)
                }).finally(() => setTimeout(() => {
                    setThreadsLoading(false)
                }, 500))
            } else {
                setThreadsLoading(false)
            }
        });

        return () => unsubscribe();
    }, [userData?.data?.user?._id, threads.length])

    useEffect(() => {
        if (!userData?.data?.user?._id) return;
        const querySearch = query(collection(db, "notifications"), where("userId", "==", userData.data.user._id), where("read", "==", false))
        const unsubscribe = onSnapshot(querySearch, (querySnapshot) => {
            setNotifications(querySnapshot.docs.map((item) => ({
                ...item.data(),
                id: item.id,
            })))
        })
        return () => unsubscribe()
    }, [userData?.data?.user?._id])

    return <ChatContext.Provider value={{ isChatSearch, setIsChatSearch, selectedChat, setSelectedChat, searchChatValue, setSearchChatValue, searchData, setSearchData, messages, setMessages, threads, setThreads, notifications, setNotifications, messagesLoading, setMessagesLoading, threadsLoading, setThreadsLoading, isInfoOpen, setIsInfoOpen, location, userData }}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContextType => {
    let context = useContext(ChatContext)
    if (!context) {
        throw new Error("use useUser in User Provider");
    }
    return context;
}
