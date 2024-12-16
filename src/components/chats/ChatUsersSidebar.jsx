import { useEffect, useState } from "react"
import { ChatSearchIcon } from "../../assets/Constants"
import { useUser } from "../../context/UserContext"
import { NoteDiv } from "../note/NoteDiv"
import { useChat } from "../../context/ChatContext"
import { UserThreads } from "./UserThreads"
import { Skeleton } from "../helpers/Skeleton";
import { fetchNote } from "../../services/note"


export function ChatUsersSidebar() {
    const { userData, note, setNote } = useUser()
    const { setIsChatSearch, threads, threadsLoading } = useChat()
    const [noteLoading, setNoteLoading] = useState(false)

    useEffect(() => {
        fetchNote(setNoteLoading, userData, setNote);
    }, [])

    return <div className="bg-[#000] mt-7 md:mt-0 overflow-auto scrollbar-hidden border-r-[2px] border-[#262626] md:w-[23.5rem] h-[95vh] md:h-[100vh] relative top-0 flex flex-col items-center md:block gap-12 left-0 py-12">
        <div className="flex justify-between px-5">
            <h1 className="text-[22px] md:block hidden font-semibold">{userData.data.user.userName}</h1>
            <button onClick={() => setIsChatSearch(true)} className="hover:opacity-70 transition duration-200"><ChatSearchIcon /></button>
        </div>
        <div className="relative mt-14 px-5 md:block hidden">
            {note.length !== 0 && <NoteDiv notes={note} isChat={true} />}
            <img src={userData.data.user.profilePic} className="w-16 rounded-full" alt="ProfilePic" />
            <p className="text-[#A8A8A8] text-[13px] ml-1 mt-1">Your Note</p>
        </div>
        <h1 className="mt-8 mb-3 text-[17px] px-5 font-semibold md:block hidden">Messages</h1>
        <div className="flex flex-col gap-3">
            {!threadsLoading ? threads.map((item, index) => <UserThreads key={index} item={item} />) : Array.from({ length: 5 }, (_, i) => <div key={i} className="mt-2 md:ml-5"><Skeleton isThread={true} width={true} /></div>)}
        </div>
    </div>
}