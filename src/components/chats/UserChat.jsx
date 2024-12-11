import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { EmojiIcon } from "../../assets/Constants";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useSearch, useUser } from "../../context/UserContext";
import { fetchUserDataOnClick } from "../../utils/helper";
import { handleSendMessage } from "../../services/chat";
import { Loader } from "../helpers/Loader";
import { BsThreeDots } from "react-icons/bs";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export function UserChat() {
    const { userData, setMainLoading } = useUser()
    const { setSelectedProfile } = useSearch()
    const { selectedChat, messages, setMessages, messagesLoading } = useChat()
    const [isPickingEmoji, setIsPickingEmoji] = useState(false)
    const [messageValue, setMessageValue] = useState("")
    const [innerWidth, setInnerWidth] = useState(0)
    const [messagesDelete, setMessagesDelete] = useState(null)
    const [isClicked, setIsClicked] = useState(null)
    const emojiIconRef = useRef(null)
    const emojiPickerRef = useRef(null)
    const scrollRef = useRef(null);

    useEffect(() => {
        window.addEventListener("click", handleClick)
        if (messageValue.length > 0) {
            window.addEventListener("keydown", handleKeyDown)
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("click", handleClick)
        }
    }, [messageValue])

    useEffect(() => {
        setInnerWidth(window.innerWidth)
    }, [window.innerWidth])

    useEffect(() => {
        if (scrollRef.current !== null) {
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }
        if (messages !== null) {
            setMessagesDelete(Array.from(messages.length).fill(false))
            setIsClicked(Array.from(messages.length).fill(false))
        }
    }, [messages.length]);

    function handleClick(e) {
        if (emojiIconRef.current && emojiPickerRef.current && !emojiIconRef.current.contains(e.target) && !emojiPickerRef.current.contains(e.target)) {
            setIsPickingEmoji(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    return <div className="md:w-[80%] mt-10 md:mt-0 w-[90%] bg-[#000] overflow-hidden ml-0 md:ml-5 1280:ml-0">
        {messagesLoading ? <div><Loader height="h-[20vh]" widthHeight={true} /></div> :
            <><div className="py-2 px-4 border-b-[2px] border-[#262626]">
                <Link to={`/search/${selectedChat?.userName}/`} onClick={() => {
                    fetchUserDataOnClick(selectedChat?.userName, userData, null, setSelectedProfile, setMainLoading)
                    setMainLoading(true)
                }} className="flex w-[12rem] items-center gap-3">
                    <img src={selectedChat?.profilePic} className="w-12 rounded-full" alt="Profile Image" />
                    <h2 className="font-semibold text-[15px]">{selectedChat?.fullName}</h2>
                </Link>
            </div>
                <div ref={scrollRef}
                    className="overflow-y-auto h-full max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-130px)] scrollbar-hidden py-3 px-3 flex flex-col gap-5">
                    {messages.length > 0 ? messages.map((message, index) => (
                        <div key={index} onMouseEnter={() => {
                            setMessagesDelete(Array.from(messages.length).fill(false))
                            setMessagesDelete((prev) => {
                                const updated = [...prev];
                                updated[index] = true;
                                return updated;
                            })
                        }} onMouseLeave={() => {
                            if (!isClicked[index]) {
                                setMessagesDelete((prev) => {
                                    const updated = [...prev];
                                    updated[index] = false;
                                    return updated;
                                })
                            }
                        }} className={`flex items-end gap-3 ${message?.senderId === userData.data.user._id ? "justify-end" : "justify-start"
                            }`}>
                            {messagesDelete[index] && message.senderId === userData?.data.user._id && <button className="-translate-y-[70%] relative" onClick={() => setIsClicked((prev) => {
                                const updated = [...prev];
                                updated[index] = !updated[index];
                                return updated;
                            })}>
                                {isClicked[index] && <div className="absolute md:-left-36 -left-[6.5rem] flex hover:opacity-80 transition duration-200 items-center justify-center rounded-lg bg-[#262626] -top-6 md:w-32 md:h-12 w-24 h-10">
                                    <button onClick={() => deleteDoc(doc(db, "messagesThread", [userData.data.user._id, selectedChat._id].sort().join("_"), "messages", message.id))} className="text-red-500">Delete</button>
                                </div>
                                }
                                <BsThreeDots />
                            </button>}
                            {message.senderId !== userData.data.user._id && <img src={selectedChat?.profilePic} alt={`Chat User ${message?.userName}`} className="w-6 rounded-full " />}
                            <div className={`p-2.5 rounded-xl text-sm max-w-xs ${message.senderId === userData.data.user._id ? "bg-[#0096f4] text-white" : "bg-[#262626]"}`}>
                                {message.content}
                            </div>
                        </div>
                    )) : ""}
                </div>
                <div className="bg-[#000] h-5 md:h-12 w-full px-4 py-2 relative">
                    <button className="absolute left-7 top-4 hover:opacity-55 transition duration-200" ref={emojiIconRef} onClick={() => setIsPickingEmoji((prev) => !prev)}><EmojiIcon /></button>
                    {isPickingEmoji &&
                        <div className="absolute md:-top-[22rem] -top-[18rem] md:left-5 left-0" ref={emojiPickerRef}>
                            <EmojiPicker width={innerWidth > 768 ? 350 : 300} height={innerWidth > 768 ? 350 : 300} onEmojiClick={(emoji) => setMessageValue((prev) => prev + emoji.emoji)} theme="dark" />
                        </div>
                    }
                    <input type="text" value={messageValue} className="w-[100%] rounded-3xl bg-transparent outline-none border-[1px] border-[#a2a2a2] px-12 py-2" placeholder="Message..." onChange={(e) => setMessageValue(e.target.value)} />
                    <button className={`text-[#0096f4] ${messageValue.length === 0 ? "opacity-70" : " hover:text-white"} text-[14px] absolute right-10 top-[1.1rem] transition duration-100`} disabled={messageValue.length === 0} onClick={() => handleSendMessage(setMessages, messages, messageValue, userData, setMessageValue, selectedChat)}>Send</button>
                </div></>
        }
    </div>
}