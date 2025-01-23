import { useState } from "react";
import { useUser } from "../../context/UserContext";
import NoteTooltip from "./Note";
import { Loader } from "../helpers/Loader";
import { NoteCreator } from "./NoteCreator";
import { useAuth } from "../../context/AuthContext";
import { noteDelete } from "../../services/note";

export const NoteEditor: React.FC = () => {
    const { note, setMessage, setNote, setIsNoteEditOpen } = useUser();
    const { userData, token } = useAuth()
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false)


    const deleteNote = async () => {
        try {
            setDeleteLoading(true);
            const res = await noteDelete({
                token
            })
            setMessage(res.message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsNoteEditOpen(false);
            setNote([]);
            setDeleteLoading(false);
        }
    }

    return <div className="absolute w-[20rem] h-[20rem] px-4 flex items-center flex-col justify-evenly bg-[#262626] rounded-xl -left-80 top-[5.2rem] z-[100] lg:left-0 lg:top-0 lg:w-[18rem] lg:h-[18rem]">
        <div className="absolute top-[3rem] left-[50%] cursor-pointer lg:top-[12%] -translate-x-1/2">
            <NoteTooltip isProfile={true} isEditor={true} note={note} className="md:text-[18px]" />
        </div>
        <img src={userData?.data?.user.profilePic} alt="User Profile" className="rounded-full w-40" />
        <div className="w-full flex flex-col gap-2 relative">
            <button className="bg-[#0095F6] w-full rounded-lg text-[14px] py-1.5 transition duration-200 hover:bg-opacity-70" onClick={() => {
                setIsNoteOpen(true)
            }}>Leave a new Note</button>
            {!deleteLoading ? <button className="w-full text-[#0095f6] text-[14px] absolute -bottom-7 hover:text-white" onClick={deleteNote}>Delete note</button> : <div className="absolute -bottom-40 md:-top-36 left-1/2 -translate-x-1/2"><Loader widthHeight={true} /></div>}
            <NoteCreator isEditing={true} isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} />
        </div>
    </div>

}