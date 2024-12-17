import { useNavigate } from "react-router-dom"
import { useChat } from "../../context/ChatContext"
import { useUser } from "../../context/UserContext"
import { deleteChatForUser } from "../../services/chat"
import { UserThreads } from "./UserThreads"
import { useState } from "react"
import { Loader } from "../helpers/Loader"

export function UserChatInfo() {
    const { isInfoOpen, selectedChat, setThreads } = useChat()
    const { userData } = useUser()
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    return <div
        className={`${isInfoOpen ? "lg:max-w-[23rem] md:max-w-[220px] w-full md:h-[100vh] h-[92vh] block " : "w-0 hidden"} md:block transition-all duration-300 xl:transition-none md:border-[#262626] md:border-l-[2px] md:relative absolute top-0 right-0 bg-[#000]`}>
        <div className="border-[#262626] py-[1.17rem] mt-10 md:mt-0 border-b-[2px]">
            <h1 className="ml-5 text-[18px] font-semibold">Details</h1>
        </div>
        <div className="pt-3 flex flex-col gap-3">
            <h1 className="px-4 text-[18px] font-semibold">Members</h1>
            <UserThreads isNewChat={true} item={selectedChat} isChat={true} />
        </div>
        <div className="absolute md:py-5 py-3 px-4 w-full bottom-16 md:bottom-3 border-t-[2px] border-[#262626]">
            <button onClick={() => deleteChatForUser(userData?.data.user._id, selectedChat?._id, setThreads, navigate, setIsDeleting)} className="text-[#ED4956]">{isDeleting ? <div><Loader height="h-[0vh]" widthHeight={true} /></div> : "Delete"}</button>
        </div>
    </div>
}