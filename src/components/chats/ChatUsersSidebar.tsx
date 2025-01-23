import { useEffect, useState } from "react"
import { ChatSearchIcon } from "../../assets/Constants"
import { useUser } from "../../context/UserContext"
import { NoteDiv } from "../note/NoteDiv"
import { useChat } from "../../context/ChatContext"
import { UserThreads } from "./UserThreads"
import { Skeleton } from "../helpers/Skeleton"
import { useLocation, useNavigate } from "react-router-dom"
import { NoteCreator } from "../note/NoteCreator"
import { useAuth } from "../../context/AuthContext"


export function ChatUsersSidebar() {
    const { note, fetchNote } = useUser()
    const { userData } = useAuth()
    const { setIsChatSearch, threads, threadsLoading, selectedChat } = useChat()
    const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedChat !== null) {
            navigate(`/direct/inbox/t/${selectedChat?._id}`)
        }
        fetchNote();
    }, [selectedChat?._id])

    return <>
        <div className={`bg-[#000] mt-0 overflow-auto scrollbar-hidden md:border-r-[2px] md:border-[#262626] md:w-[17.5rem] lg:w-[23.5rem] md:h-[100vh] relative top-0 flex flex-col items-center md:block md:gap-12 gap-5 left-0 md:py-12 py-7 ${location.pathname.slice(16, -1) === "" ? "w-full h-[95vh]" : "w-0"}`}>
            <div className="md:flex justify-between px-5 hidden">
                <h1 className="text-[22px] font-semibold">{userData?.data.user.userName}</h1>
                <button onClick={() => setIsChatSearch(true)} className=" hover:opacity-70 transition duration-200"><ChatSearchIcon /></button>
            </div>
            <div className="relative w-full mt-14 px-5">
                <span onClick={() => {
                    if (note?.length === 0) {
                        setIsNoteOpen(true)
                    }
                }} className={`${note?.length === 0 ? "cursor-pointer" : ""}`}>
                    <NoteDiv notes={note} isChat={true} />
                </span>
                <img src={userData.data.user.profilePic} className="w-16 rounded-full" alt="ProfilePic" />
                <p className="text-[#A8A8A8] text-[13px] ml-1 mt-1">Your Note</p>
            </div>
            <h1 className="md:mt-8 md:mb-3 text-[17px] w-full px-5 font-semibold">Messages</h1>
            <div className="flex flex-col gap-3 w-full">
                {!threadsLoading ? threads.map((item, index) => <UserThreads key={index} item={item} isChat={true} />) : Array.from({ length: 5 }, (_, i) => <div key={i} className="ml-5"><Skeleton width={true} /></div>)}
            </div>
        </div >
        <NoteCreator isEditing={false} isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} />
    </>
}