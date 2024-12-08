import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { db } from "../firebaseConfig";

const ChatContext = createContext()

export function ChatProvider({ children }) {
    const { userData } = useUser()
    const [isChatSearch, setIsChatSearch] = useState(false)
    const [selectedChat, setSelectedChat] = useState(null)
    const [searchData, setSearchData] = useState([])
    const [searchChatValue, setSearchChatValue] = useState("")
    const [messages, setMessages] = useState([])
    const [threads, setThreads] = useState([])

    useEffect(() => {
        if (selectedChat && userData) {
            const querySearch = query(collection(db, "messagesThread", [userData.data.user._id, selectedChat._id].sort().join("_"), "messages"), orderBy("timeStamp"))
            const unsubscribe = onSnapshot(querySearch, (querySnapShote) => {
                setMessages(querySnapShote.docs.map((item) => item.data()))
            })
            return () => unsubscribe()
        }
    }, [selectedChat, userData])

    useEffect(() => {
        if (!userData?.data?.user?._id) return;

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
                            lastMessage: foundArr[index].lastMessage
                        }
                        return returnObj;
                    } catch (error) {
                        console.error(error)
                    }
                }
                Promise.all(foundIds.map((item, index) => fetchUserById(item, index))).then((res) => {
                    setThreads(res)
                })
            }
        });

        return () => unsubscribe();
    }, [userData?.data?.user?._id])

    return <ChatContext.Provider value={{ isChatSearch, setIsChatSearch, selectedChat, setSelectedChat, searchChatValue, setSearchChatValue, searchData, setSearchData, messages, setMessages, threads, setThreads }}>{children}</ChatContext.Provider>
}

export function useChat() {
    let context = useContext(ChatContext)
    return context;
}