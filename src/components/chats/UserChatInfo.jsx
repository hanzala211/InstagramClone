import { useChat } from "../../context/ChatContext"
import { UserThreads } from "./UserThreads"

export function UserChatInfo() {
    const { isInfoOpen, selectedChat } = useChat()

    return <div
        className={`${isInfoOpen ? "lg:max-w-[23rem] md:max-w-[220px] w-full h-[100vh]" : "w-0"
            } transition-all duration-300 xl:transition-none border-[#262626] border-l-[2px] md:relative absolute top-0 right-0 bg-[#000]`}
    >
        <div className="border-[#262626] py-[1.17rem] mt-10 md:mt-0 border-b-[2px]">
            <h1 className="ml-5 text-[18px] font-semibold">Details</h1>
        </div>
        <div className="pt-3 flex flex-col gap-3">
            <h1 className="px-4 text-[18px] font-semibold">Members</h1>
            <UserThreads isNewChat={true} item={selectedChat} isChat={true} />
        </div>
        <div className="absolute py-5 px-4 w-full bottom-16 md:bottom-3 border-t-[2px] border-[#262626]">
            <button className="text-[#ED4956]">Delete</button>
        </div>
    </div>
}