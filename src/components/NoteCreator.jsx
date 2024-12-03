import { IoCloseSharp } from "react-icons/io5";
import { useUser } from "../context/UserContext";
import NoteTooltip from "./Note";
import { Loader } from "./Loader";

export function NoteCreator({ handleClose, isNoteOpen, noteValue, setNoteValue, noteFunction, shareLoading }) {
    const { userData } = useUser();
    const isDisabled = noteValue.length === 0;

    return <>
        <div
            className={`overlay opacity-0 z-[10] transition-all duration-500 ${!isNoteOpen ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={() => handleClose()}
        ></div>
        <div
            className={`fixed opacity-0 top-[50%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isNoteOpen ? "opacity-100" : "pointer-events-none"
                } border-y-[1px] border-[#363636] h-[65vh] w-full max-w-[25rem] xl:max-w-[28vw] p-4 bg-[#262626] rounded-2xl`}
        >
            <div className="flex justify-between items-center">
                <IoCloseSharp
                    className={`text-[25px] cursor-pointer opacity-0 ${isNoteOpen ? "opacity-100" : "pointer-events-none"}`}
                    onClick={() => handleClose()}
                />
                <h2 className="font-bold text-[20px]">New Note</h2>
                {!shareLoading ?
                    <button className={`text-[#0095F6] ${isDisabled ? "opacity-50" : "hover:text-white transition duration-150"}`} disabled={isDisabled} onClick={() => noteFunction()}>Share</button> : <div><Loader height="h-[0vh]" widthHeight={true} /></div>}
            </div>
            <div className="flex justify-center items-center h-[85%]">
                <div className="relative">
                    <div className="absolute -top-4 left-[60%]">
                        <NoteTooltip isProfile={false} noteValue={noteValue} setNoteValue={setNoteValue} />
                    </div>
                    <img src={userData?.data?.user.profilePic} alt="User Profile" className="rounded-full w-40" />
                </div>
            </div>
        </div>
    </>
}