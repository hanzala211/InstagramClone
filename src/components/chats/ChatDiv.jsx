import { StartChatIcon } from "../../assets/Constants";
import { useChat } from "../../context/ChatContext";

export function ChatDiv() {
    const { setIsChatSearch } = useChat()

    return <div className="flex flex-col gap-2 items-center justify-center md:w-[80%] w-[90%]">
        <StartChatIcon />
        <h1>Your messages</h1>
        <p className="text-[#A8A8A8] text-[13px] text-center">Send private photos and messages to a friend or group.</p>
        <button onClick={() => setIsChatSearch(true)} className="bg-[#0095F6] text-white px-4 py-1.5 hover:bg-opacity-80 transition duration-300 rounded-lg font-semibold text-[14px]">Send message</button>
    </div>
}