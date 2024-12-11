import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { EmojiIcon } from "../../assets/Constants";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useSearch, useUser } from "../../context/UserContext";
import { fetchUserDataOnClick } from "../../utils/helper";
import { handleSendMessage } from "../../services/chat";

export function UserChat() {
    const { userData, setMainLoading } = useUser()
    const { setSelectedProfile } = useSearch()
    const { selectedChat, messages, setMessages } = useChat()
    const [isPickingEmoji, setIsPickingEmoji] = useState(false)
    const [messageValue, setMessageValue] = useState("")
    const [innerWidth, setInnerWidth] = useState(0)
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
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
        <div className="py-2 px-4 border-b-[2px] border-[#262626]">
            <Link to={`/search/${selectedChat.userName}/`} onClick={() => {
                fetchUserDataOnClick(selectedChat.userName, userData, null, setSelectedProfile, setMainLoading)
                setMainLoading(true)
            }} className="flex w-[12rem] items-center gap-3">
                <img src={selectedChat.profilePic} className="w-12 rounded-full" alt="Profile Image" />
                <h2 className="font-semibold text-[15px]">{selectedChat.fullName}</h2>
            </Link>
        </div>
        <div ref={scrollRef}
            className="overflow-y-auto h-full max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-130px)] scrollbar-hidden py-3 px-3 flex flex-col gap-5">
            {messages.length > 0 ? messages.map((message, index) => (
                <div key={index} className={`flex items-end gap-2 ${message.senderId === userData.data.user._id ? "justify-end" : "justify-start"
                    }`}>
                    {message.senderId !== userData.data.user._id && <img src={selectedChat?.profilePic} alt={`Chat User ${message.userName}`} className="w-6 rounded-full " />}
                    <div
                        className={`p-2.5 rounded-xl text-sm max-w-xs ${message.senderId === userData.data.user._id
                            ? "bg-[#0096f4] text-white"
                            : "bg-[#262626]"
                            }`}
                    >
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
        </div>
    </div>
}