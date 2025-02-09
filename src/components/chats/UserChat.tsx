import EmojiPicker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import { ActiveChatInfoSVG, ChatInfoSVG, EmojiIcon, ShareIcon } from "../../assets/Constants";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";
import { deleteMessageAndUpdateThread, handleSendMessage } from "../../services/chat";
import { Loader } from "../helpers/Loader";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Post } from "../post/Post";
import { usePost } from "../../context/PostContext";
import { UserChatInfo } from "./UserChatInfo";
import { getDataOnClick } from "../../services/searchProfile";
import { useAuth } from "../../context/AuthContext";

export const UserChat: React.FC = () => {
    const { selectedChat, messages, setMessages, messagesLoading, isInfoOpen, setIsInfoOpen } = useChat()
    const { innerWidth } = useUser()
    const { userData, setMainLoading, token, setSelectedProfile } = useAuth()
    const { setSelectedPost, selectedPost } = usePost()
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false)
    const [currentPost, setCurrentPost] = useState<number | any>(0)
    const [isPickingEmoji, setIsPickingEmoji] = useState<boolean>(false)
    const [messageValue, setMessageValue] = useState<string>("")
    const [messagesDelete, setMessagesDelete] = useState<any[]>([])
    const [isClicked, setIsClicked] = useState<any[]>([])
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
    const emojiIconRef = useRef<HTMLButtonElement>(null)
    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null);
    const deleteDivRef = useRef<HTMLDivElement>(null)
    const iconRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isKeyboardOpen) {
            document.body.style.paddingBottom = "3rem";
        } else {
            document.body.style.paddingBottom = "0";
        }
    }, [isKeyboardOpen]);

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
        if (scrollRef.current !== null) {
            scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }
        if (Array.isArray(messages)) {
            const newArray: any[] = Array.from(messages?.length).fill(false);
            setMessagesDelete(newArray);
            setIsClicked(newArray);
        }
    }, [messages]);

    function handleClick(e: any) {
        if (emojiIconRef.current && emojiPickerRef.current && !emojiIconRef.current.contains(e.target) && !emojiPickerRef.current.contains(e.target)) {
            setIsPickingEmoji(false)
        }
        if (iconRef.current && !iconRef.current.contains(e.target) && deleteDivRef.current && !deleteDivRef.current.contains(e.target)) {
            setIsClicked(Array.from(messages.length).fill(false))
            setMessagesDelete(Array.from(messages.length).fill(false))
        }
    }

    function handleKeyDown(e: any) {
        if (e.key === "Enter") {
            handleSendMessage(setMessages, messageValue, userData, setMessageValue, selectedChat)
        }
    }

    const handleFocus = () => {
        setIsKeyboardOpen(true);
    };

    const handleBlur = () => {
        setIsKeyboardOpen(false);
    }

    const fetchUserDataOnClick = async () => {
        try {
            setMainLoading(true);
            const res = await getDataOnClick({
                username: selectedChat?.userName,
                token
            })
            setSelectedProfile(res.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setMainLoading(false);
            }, 1000);
        }
    }


    return <>
        <div className={`mt-12 md:mt-0 transition-[width] duration-200 ${isInfoOpen ? "w-0" : "w-[100%] "} md:w-[80%]  bg-[#000] overflow-hidden flex`}>
            <div className={`${isInfoOpen ? "w-[80%] lg:w-full" : " w-full"}`}>
                <div className="py-2 px-4 border-b-[2px] md:flex justify-between items-center hidden border-[#262626]">
                    <Link to={`/search/${selectedChat?.userName}/`} onClick={() => {
                        fetchUserDataOnClick()
                        setMainLoading(true)
                    }} className="flex items-center gap-3">
                        <img src={selectedChat?.profilePic} className="w-12 rounded-full" alt="Profile Image" />
                        <h2 className="font-semibold text-[15px]">{selectedChat?.fullName}</h2>
                    </Link>
                    <button onClick={() => setIsInfoOpen((prev) => !prev)}>{isInfoOpen ? <ActiveChatInfoSVG /> : <ChatInfoSVG />}</button>
                </div>
                <div ref={scrollRef}
                    className="overflow-y-auto h-full max-h-[calc(100dvh-24vh)] md:max-h-[calc(100dvh-130px)] scrollbar-hidden py-3 px-3 flex flex-col gap-5">
                    {messagesLoading ?
                        <div><Loader height="h-[10vh]" widthHeight={true} /></div>
                        :
                        messages.length > 0 ? messages.map((message: any, index: number) => (
                            <div key={index} onMouseEnter={() => {
                                setMessagesDelete(Array.from(messages.length).fill(false))
                                setMessagesDelete((prev) => {
                                    const updated: boolean[] = [...prev];
                                    updated[index] = true;
                                    return updated;
                                })
                            }} onMouseLeave={() => {
                                if (!isClicked[index]) {
                                    setIsClicked(Array.from(messages.length).fill(false))
                                    setMessagesDelete((prev) => {
                                        const updated: boolean[] = [...prev];
                                        updated[index] = false;
                                        return updated;
                                    })
                                }
                            }}
                                onTouchStart={() => {
                                    setMessagesDelete(Array.from(messages.length).fill(false))
                                    setMessagesDelete((prev) => {
                                        const updated: boolean[] = [...prev];
                                        updated[index] = true;
                                        return updated;
                                    })
                                }} className={`flex items-end gap-3 ${message?.senderId === userData?.data?.user._id || message?.status === "sending" ? "justify-end" : "justify-start"
                                    }`}>
                                {messagesDelete[index] && message?.senderId === userData?.data.user._id && <button className="relative" onClick={() => setIsClicked((prev) => {
                                    const updated: boolean[] = [...prev];
                                    updated[index] = !updated[index];
                                    return updated;
                                })}>
                                    {isClicked[index] && <div ref={deleteDivRef} onClick={() => {
                                        deleteMessageAndUpdateThread(userData.data.user._id, selectedChat?._id, message?.id);
                                    }} className="absolute md:-left-36 440:-left-[4rem] flex hover:opacity-80 transition duration-200 items-center justify-center rounded-lg bg-[#262626] -top-10 md:-top-6 md:w-32 md:h-12 w-24 h-10 text-red-500">Delete</div>
                                    }
                                    <div ref={iconRef} className="text-[14px] hover:bg-[#a8a8a8] hover:bg-opacity-50 rounded-full p-1">
                                        <BsThreeDotsVertical />
                                    </div>
                                </button>}
                                {message?.senderId !== userData.data.user._id || message?.status === "sending" && <img src={selectedChat?.profilePic} alt={`Chat User ${message?.userName}`} className="w-6 rounded-full " />}
                                {message.content && <div className="flex flex-row items-end gap-1">
                                    <div className={`p-2.5 rounded-xl text-sm max-w-xs ${message?.senderId === userData.data.user._id || message?.status === "sending" ? "bg-[#0096f4] text-white" : "bg-[#262626]"}`}>
                                        {message?.content}
                                    </div>
                                    {message?.status === "sending" && <ShareIcon className="w-4" />}
                                </div>}
                                {message.post && <div onClick={() => {
                                    setSelectedPost(message.post)
                                    if (innerWidth > 770) {
                                        setIsPostOpen(true)
                                    } else {
                                        navigate(`/${message?.post?.user?.userName}/p/${message.post._id}/`)
                                    }
                                }} className="md:w-[18rem] w-[13rem] cursor-pointer bg-[#262626] rounded-lg">
                                    <div className="px-3 py-2 flex gap-2 items-center">
                                        <img src={message?.post?.user?.profilePic} className="w-8 rounded-full" alt="" />
                                        <button className="text-[14px]">{message?.post?.user?.userName}</button>
                                    </div>
                                    <img src={message?.post?.imageUrls[0]} alt={`${message?.post?.user?.userName} post`} />
                                    <div className={`text-[15px] font-semibold ${message.post.caption !== null && message?.post.caption.length > 0 ? "px-4 py-3" : ""}`}>
                                        {message.post.caption}
                                    </div>
                                </div>}
                            </div>
                        )) : ""}
                </div>
                <div className="bg-[#000] h-20 md:h-12 w-full px-4 py-3 md:py-2 md:relative fixed md:bottom-0 bottom-10">
                    <button className="absolute left-7 top-5 md:top-4 hover:opacity-55 transition duration-200" ref={emojiIconRef} onClick={() => setIsPickingEmoji((prev) => !prev)}><EmojiIcon /></button>
                    {isPickingEmoji &&
                        <div className="absolute md:-top-[22rem] -top-[18rem] md:left-5 left-0" ref={emojiPickerRef}>
                            <EmojiPicker width={innerWidth > 770 ? 350 : 300} height={innerWidth > 770 ? 350 : 300} onEmojiClick={(emoji) => setMessageValue((prev) => prev + emoji.emoji)} theme="dark" />
                        </div>
                    }
                    <input
                        type="text"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={messageValue}
                        className="w-[100%] rounded-3xl bg-transparent outline-none border-[1px] border-[#a2a2a2] px-12 pr-16 py-2"
                        placeholder="Message..."
                        onChange={(e) => setMessageValue(e.target.value)}
                    />
                    <button
                        className={`text-[#0096f4] ${messageValue.length === 0 ? "opacity-70" : "hover:text-white"} h-[60%] text-[14px] absolute right-10 top-[0.5rem] md:top-[0.8rem] transition duration-100`}
                        disabled={messageValue.length === 0}
                        onClick={() => handleSendMessage(setMessages, messageValue, userData, setMessageValue, selectedChat)}
                        onTouchStart={() => handleSendMessage(setMessages, messageValue, userData, setMessageValue, selectedChat)}>Send</button>
                </div>
            </div>
            <UserChatInfo />
        </div >
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={selectedPost?.user} currentPost={currentPost} setCurrentPost={setCurrentPost} />
    </>
}