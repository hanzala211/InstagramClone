import { IoCloseSharp } from "react-icons/io5"
import { useChat } from "../../context/ChatContext"
import { UserThreads } from "./UserThreads"
import { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext"
import { Skeleton } from "../helpers/Skeleton"
import { fetchSearch } from "../../services/search"

export function NewChat() {
    const { setIsChatSearch, isChatSearch, searchChatValue, setSearchChatValue, searchData, setSearchData } = useChat()
    const { userData } = useUser()
    const [searchLoading, setSearchLoading] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (searchChatValue.length > 0) {
            setSearchLoading(true);
            fetchSearch(signal, setSearchData, searchChatValue, userData, setSearchLoading);
        } else if (searchChatValue.length === 0) {
            setSearchLoading(false)
            setSearchData([]);
        }
        return () => abortController.abort();
    }, [searchChatValue])

    function handleClose() {
        setIsChatSearch(false)
        setSearchChatValue("")
        setSearchData([])
    }
    return <>
        <div
            className={`overlay z-[100] opacity-0 transition-all duration-500 ${!isChatSearch ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div className={`fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 bg-[#262626] 440:w-[25rem] w-[21rem] flex flex-col rounded-xl h-[60vh] sm:w-[40rem] sm:h-[70vh] md:w-[40rem] md:h-[70vh] z-[100] ${isChatSearch ? "opacity-100" : "pointer-events-none opacity-0"} transition duration-300`}>
            <div className="w-full py-2 border-b-[1px] border-[#363636] flex justify-center">
                <h1 className="text-[18px] font-semibold">New message</h1>
                <button onClick={handleClose} className="text-[28px] absolute right-2"><IoCloseSharp /></button>
            </div>
            <div className="flex gap-4 items-center px-5 border-b-[1px] border-[#363636] py-2">
                <p className="font-semibold">To:</p>
                <input type="text" className="w-full outline-none bg-transparent placeholder:text-[#a8a8a8]" placeholder="Search..." value={searchChatValue} onChange={(e) => setSearchChatValue(e.target.value)} />
            </div>
            <div className="h-full overflow-y-auto scrollbar-hidden">
                {searchLoading ? Array.from(({ length: 30 }), (_, i) => <div key={i} className="ml-3 mt-5"><Skeleton /></div>) : ""}
                {searchData.map((item, index) => (
                    <div key={index} className="hover:bg-[#a8a8a8] hover:bg-opacity-30 transition-all duration-300">
                        <UserThreads isNewChat={true} item={item} />
                    </div>
                ))}
            </div>
        </div>
    </>
}