import { IoCloseSharp } from "react-icons/io5"
import { useChat } from "../../context/ChatContext"
import { UserThreads } from "./UserThreads"
import { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext"
import { Skeleton } from "../helpers/Skeleton"
import { fetchSearch } from "../../services/search"
import { usePost } from "../../context/PostContext"

interface SearchChatProps {
    header: string;
    isChat: boolean;
    index?: number;
}

export const SearchChat: React.FC<SearchChatProps> = ({ header, isChat, index }) => {
    const { setIsChatSearch, threads, isChatSearch, searchChatValue, setSearchChatValue, searchData, setSearchData } = useChat()
    const { isShareOpen, setIsShareOpen, isShareSearch, setIsShareSearch, isShareOpenHome, setIsShareOpenHome } = usePost()
    const { userData } = useUser()
    const [searchLoading, setSearchLoading] = useState(false)
    const isVisible = isChat ? isChatSearch : isShareOpen || isShareOpenHome[index];

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (searchChatValue.length > 0 || isShareSearch.length > 0) {
            setSearchLoading(true);
            fetchSearch(signal, setSearchData, isChat ? searchChatValue : isShareSearch, userData, setSearchLoading);
        } else if (searchChatValue.length === 0) {
            setSearchLoading(false)
            setSearchData([]);
        }
        return () => abortController.abort();
    }, [searchChatValue, isShareSearch])

    function handleClose() {
        setIsChatSearch(false)
        setSearchChatValue("")
        setIsShareSearch("")
        setSearchData([])
        setIsShareOpen(false)
        setIsShareOpenHome((prev) => {
            const updated = [...prev]
            updated[index] = false;
            return updated;
        })
    }

    return <>
        <div
            className={`overlay z-[150] transition-all duration-500 ${!isVisible ? "pointer-events-none opacity-0" : "backdrop-blur-sm opacity-100"}`}
            onClick={handleClose}
        ></div>
        <div className={`fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 bg-[#262626] 440:w-[25rem] w-[21rem] flex flex-col rounded-xl h-[60vh] sm:w-[40rem] sm:h-[70vh] md:w-[40rem] md:h-[70vh] z-[170] ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"} transition duration-300`}>
            <div className="w-full py-2 border-b-[1px] border-[#363636] flex justify-center">
                <h1 className="text-[18px] font-semibold">{header}</h1>
                <button onClick={handleClose} className="text-[28px] absolute right-2"><IoCloseSharp /></button>
            </div>
            <div className="flex gap-4 items-center px-5 border-b-[1px] border-[#363636] py-2">
                <p className="font-semibold">To:</p>
                <input type="text" className="w-full outline-none bg-transparent placeholder:text-[#a8a8a8]" placeholder="Search..." value={isChat ? searchChatValue : isShareSearch} onChange={(e) => {
                    if (isChat) {
                        setSearchChatValue(e.target.value)
                    } else {
                        setIsShareSearch(e.target.value)
                    }
                }} />
            </div>
            <div className="h-full overflow-y-auto scrollbar-hidden">
                {searchLoading ? Array.from(({ length: 30 }), (_, i) => <div key={i} className="ml-3 mt-5"><Skeleton /></div>) : ""}
                {searchData.length > 0 ? searchData.map((item, index) => (
                    <div key={index} className="hover:bg-[#a8a8a8] hover:bg-opacity-30 transition-all duration-300">
                        <UserThreads handleClose={handleClose} isNewChat={true} item={item} isChat={isChat} />
                    </div>
                )) : isChat ? "" : threads.map((item, index) => (<div key={index} className="hover:bg-[#a8a8a8] hover:bg-opacity-30 transition-all duration-300">
                    <UserThreads handleClose={handleClose} isNewChat={true} item={item} isChat={isChat} />
                </div>))}
            </div>
        </div>
    </>
}