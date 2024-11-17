import { useState } from "react";
import { useUser } from "../context/UserContext"
import NoteTooltip from "./Note";
import { Loader } from "./Loader";
import { NoteCreator } from "./NoteCreator";

export function NoteEditor({ setIsNoteEditOpen }) {
    const { userData, note, setMessage, setNote } = useUser();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false)
    const [noteValue, setNoteValue] = useState("");
    async function deleteNote() {
        try {
            setDeleteLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/note`, {
                method: "DELETE",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                body: "",
                redirect: "follow"
            })
            const result = await response.json()
            console.log(result)
            setMessage(result.message)
        } catch (error) {
            console.error(error)
        } finally {
            setIsNoteEditOpen(false)
            setNote([]);
            setDeleteLoading(false);
        }
    }
    async function updateNote() {
        try {
            setShareLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/note`, {
                method: "PUT",
                headers: {
                    "Authorization": `${userData.data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "content": noteValue
                }),
                redirect: "follow"
            })
            const result = await response.json();
            setMessage(result.message);
            setNote(result.note)
        } catch (error) {
            console.error(error)
        } finally {
            setShareLoading(false);
            setIsNoteOpen(false)
            setIsNoteEditOpen(false);
        }
    }
    function handleCloseNote() {
        setIsNoteOpen(false)
        setNoteValue("");
    }
    return <div className="absolute w-[20rem] h-[20rem] px-4 flex items-center flex-col justify-evenly bg-[#262626] rounded-xl -left-80 top-[5.2rem] z-[100]">
        <div className="absolute top-[8%] left-[43%] cursor-pointer">
            <NoteTooltip isProfile={true} note={note} className="text-[18px]" />
        </div>
        <img src={userData?.data?.user.profilePic} alt="User Profile" className="rounded-full w-40" />
        <div className="w-full flex flex-col gap-2 relative">
            <button className="bg-[#0095F6] w-full rounded-lg text-[14px] py-1.5 transition duration-200 hover:bg-opacity-70" onClick={() => {
                setIsNoteOpen(true)
            }}>Leave a new Note</button>
            {!deleteLoading ? <button className="w-full text-[#0095f6] text-[14px] absolute -bottom-8 hover:text-white" onClick={() => deleteNote()}>Delete note</button> : <div className="absolute -top-36 left-1/2 -translate-x-1/2"><Loader widthHeight={true} /></div>}
            <NoteCreator isNoteOpen={isNoteOpen} handleClose={handleCloseNote} noteValue={noteValue} noteFunction={updateNote} setNoteValue={setNoteValue} shareLoading={shareLoading} />
        </div>
    </div>
}