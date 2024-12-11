import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../firebaseConfig";
import { useLocation } from "react-router-dom";

const ChatContext = createContext()

export function ChatProvider({ children }) {
    const { userData } = useUser()
    const [isChatSearch, setIsChatSearch] = useState(false)
    const [selectedChat, setSelectedChat] = useState(null)
    const [searchData, setSearchData] = useState([])
    const [searchChatValue, setSearchChatValue] = useState("")
    const [messages, setMessages] = useState([])
    const [threads, setThreads] = useState([])
    const [notifications, setNotifications] = useState([])
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [threadsLoading, setThreadsLoading] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.slice(16, -1) !== "" && selectedChat === null) {
            async function fetchSelectedChat() {
                try {
                    const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/${location.pathname.slice(16, -1)}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `${userData.data.token}`
                        },
                        redirect: "follow"
                    })
                    const result = await response.json()
                    setSelectedChat(result.data.user)
                } catch (error) {
                    console.error(error)
                }
            }
            fetchSelectedChat()
        }
    }, [location.pathname, selectedChat, userData])

    useEffect(() => {
        if (userData && selectedChat) {
            setMessagesLoading(true)
            const querySearch = query(collection(db, "messagesThread", [userData.data.user._id, selectedChat._id].sort().join("_"), "messages"), orderBy("timeStamp"))
            const unsubscribe = onSnapshot(querySearch, (querySnapShote) => {
                setMessages(querySnapShote.docs.map((item) => ({
                    ...item.data(),
                    id: item.id
                })))
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
            where("participants", "array-contains", userData.data.user._id)
        );
        const unsubscribe = onSnapshot(querySearch, (querySnapshot) => {
            const foundArr = querySnapshot.docs.map((item) => item.data())
            const foundIds = foundArr.map((item) => item.participants.find((id) => userData.data.user._id !== id))
            if (foundIds.length > 0) {
                async function fetchUserById(id, index) {
                    try {
                        const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/${id}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `${userData.data.token}`
                            },
                            redirect: "follow"
                        })
                        const result = await response.json()
                        const returnObj = {
                            ...result.data.user,
                            lastMessage: foundArr[index].lastMessage,
                            lastMessageSender: foundArr[index].lastMessageSender,
                        }
                        return returnObj;
                    } catch (error) {
                        console.error(error)
                    }
                }
                Promise.all(foundIds.map((item, index) => fetchUserById(item, index))).then((res) => {
                    setThreads(res)
                }).finally(() => setTimeout(() => {
                    setThreadsLoading(false)
                }, 500))
            } else {
                setThreadsLoading(false)
            }
        });

        return () => unsubscribe();
    }, [userData?.data?.user?._id])

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

    return <ChatContext.Provider value={{ isChatSearch, setIsChatSearch, selectedChat, setSelectedChat, searchChatValue, setSearchChatValue, searchData, setSearchData, messages, setMessages, threads, setThreads, notifications, setNotifications, messagesLoading, setMessagesLoading, threadsLoading, setThreadsLoading }}>{children}</ChatContext.Provider>
}

export function useChat() {
    let context = useContext(ChatContext)
    return context;
}
