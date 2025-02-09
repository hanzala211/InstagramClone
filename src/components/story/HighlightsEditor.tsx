import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5"
import { SelectedHighLights } from "./SelectedHighLights"
import { ArchivesModal } from "../archives/ArchivesModal"
import { ProfileStories } from "../../types/stories"
import { useAuth } from "../../context/AuthContext"
import { highlightDelete } from "../../services/story"

interface HighlightsEditorProps {
    highLightsModal: boolean;
    setHighLightsModal: (value: boolean) => void
}

export const HighlightsEditor: React.FC<HighlightsEditorProps> = ({ highLightsModal, setHighLightsModal }) => {
    const { currentHighLight, setCurrentHighLight, highlights, setHighlights } = useUser()
    const { token } = useAuth()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [selectStatus, setSelectStatus] = useState<boolean>(false)
    const [highlightName, setHighlightName] = useState<string>("")
    const [selectedIDs, setSelectedIDs] = useState<ProfileStories[]>([])
    const [selectCover, setSelectCover] = useState<boolean>(false);
    const [currentID, setCurrentID] = useState<number>(0)
    const [sendLoading, setSendLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        setSelectedIDs((prev) => [...prev])
    }, [])


    function handleClose() {
        setSelectStatus(false)
        setSelectCover(false)
        setSelectedIDs([])
        setHighlightName("")
        setHighLightsModal(false)
        setIsEditing(false)
    }

    function formatDate(num: number) {
        const date = new Date(num);
        const day = date.getDate();
        return `${day}`
    }

    function formatMonth(num: number) {
        const date = new Date(num);
        const month = date.toLocaleString('default', { month: "short" });
        return `${month} `
    }

    const deleteHighlight = async () => {
        try {
            const res = await highlightDelete({ token, highlights, currentHighLight })
            setHighlights((prev: any) => prev.filter((item: any) => item._id !== highlights[currentHighLight]._id))
            navigate(-1);
        } catch (error) {
            console.error(error);
        } finally {
            setHighLightsModal(false);
            setCurrentHighLight(0);
        }
    }

    return <>
        <div
            className={`overlay opacity-0 z-[50] transition-all duration-500 ${!highLightsModal && !isEditing ? "pointer-events-none" : "opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div className={`bg-[#262626] w-[22rem] rounded-2xl h-[8.5rem] fixed z-[1000] opacity-0 transition duration-300 inset-0 top-1/2 -translate-y-1/2 left-[52%] -translate-x-1/2 ${highLightsModal && !isEditing ? "opacity-100" : "pointer-events-none"}`}>
            <button className="text-red-600 w-full p-3 text-[14px] active:opacity-70 font-semibold border-b-[1px] border-[#363636]" onClick={deleteHighlight} >Delete</button>
            <button className="w-full p-3 border-b-[1px] text-[14px] active:opacity-70 font-semibold border-[#363636]" onClick={() => {
                setIsEditing(true)
            }}>Edit</button>
            <button className="w-full p-3 text-[14px] font-semibold active:opacity-70" onClick={() => setHighLightsModal(false)}>Cancel</button>
        </div>
        <div className={`w-full max-w-[18rem] bg-[#262626] rounded-xl h-[11rem] fixed inset-0 z-[100] top-1/2 left-[52%] -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-500 ${isEditing && !selectStatus ? "opacity-100" : "pointer-events-none"}`}>
            <div className="text-center w-full py-3 border-b-[1px] border-[#363636]">
                <p>New highlight</p>
                <IoCloseSharp
                    className={`absolute text-[25px] font-extralight top-2 right-2 z-[100000] cursor-pointer opacity-0 transition-all duration-500 ${isEditing ? "opacity-100" : "pointer-events-none"}`}
                    onClick={handleClose}
                />
            </div>
            <div className="w-full flex justify-center py-5 px-5 border-b-[1px] border-[#363636]">
                <input type="text" placeholder="Highlight name" className="bg-[#121212] w-full p-2 rounded-sm outline-none placeholder:text-[#737373] placeholder:text-[14px]" value={highlightName} onChange={(e) => setHighlightName(e.target.value)} />
            </div>
            <div className="w-full">
                <button className={`w-full py-3 text-[15px] transition-all duration-150 font-semibold ${highlightName.length > 0 ? "text-[#0095F6]" : "text-[#A8A8A8] "}`} disabled={highlightName.length === 0} onClick={() => setSelectStatus(true)}>Next</button>
            </div>
        </div>

        <ArchivesModal selectStatus={selectStatus} setSelectStatus={setSelectStatus} selectedIDs={selectedIDs} setSelectedIDs={setSelectedIDs} selectCover={selectCover} setSelectCover={setSelectCover} isCreatingHighLight={isEditing} handleClose={handleClose} left="left-[52%]" />

        <SelectedHighLights selectCover={selectCover} setSelectCover={setSelectCover} setSelectedIDs={setSelectedIDs} isCreatingHighLight={isEditing} handleClose={handleClose} selectedIDs={selectedIDs} formatMonth={formatMonth} formatDate={formatDate} currentID={currentID} setCurrentID={setCurrentID} sendLoading={sendLoading} setSendLoading={setSendLoading} editingHighlight={true} highlightName={highlightName} />
    </>
}