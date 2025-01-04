import { IoCloseSharp } from "react-icons/io5"
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Loader } from "../helpers/Loader"
import { createHighLight, editHighLight } from "../../services/story"
import { useUser } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"
import { formatDateString, formatMonth } from "../../utils/helper"
import { ProfileStories } from "../../types/stories"

interface SelectedHighLightsProps {
    selectCover?: boolean;
    setSelectCover: (value: boolean) => void;
    setSelectedIDs: (value: ProfileStories[]) => void;
    isCreatingHighLight: boolean;
    handleClose: () => void;
    selectedIDs: ProfileStories[];
    currentID: number;
    sendLoading: boolean;
    setCurrentID: (value: number) => void;
    setSendLoading: (value: boolean) => void;
    highlightName: string;
    editingHighlight: boolean
}

export const SelectedHighLights: React.FC<SelectedHighLightsProps> = ({ selectCover, setSelectCover, setSelectedIDs, isCreatingHighLight, handleClose, selectedIDs, currentID, sendLoading, setCurrentID, setSendLoading, highlightName, editingHighlight }) => {

    const { currentHighLight, highlights, highLightStories, userData, setMessage, setHighlights } = useUser()
    const navigate = useNavigate();

    return <>
        <div className={`w-full md:max-w-[30rem] max-w-[22rem] 440:max-w-[2rem] overflow-hidden bg-[#262626] rounded-xl  440:h-[76vh] h-[78vh] fixed inset-0 z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-500 ${selectCover ? "opacity-100" : "pointer-events-none"}`}>
            <div className="text-center w-full py-3 border-b-[1px] border-[#363636]">
                <button className="absolute text-[30px] top-2.5 left-0" onClick={() => {
                    setSelectCover(false)
                    setSelectedIDs([])
                }}>
                    <MdKeyboardArrowLeft />
                </button>
                <p>Select cover</p>
                <IoCloseSharp
                    className={`absolute text-[25px] font-extralight top-3 right-2 cursor-pointer opacity-0 transition-all duration-500 ${isCreatingHighLight ? "opacity-100" : "pointer-events-none"}`}
                    onClick={handleClose}
                />
            </div>
            <div className="circle-preview-container ">
                <img src={selectedIDs.length > 0 ? selectedIDs[currentID].imageUrl : ""} alt="Selected Preview" className="full-image" />
                <div className="circle-overlay">
                    <img src={selectedIDs.length > 0 ? selectedIDs[currentID].imageUrl : ""} alt="Selected Preview" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-[4px] overflow-auto h-[18vh]">
                {selectedIDs.map((item, i) => {
                    return <label key={i} className={`relative`} onClick={() => setCurrentID(i)}>
                        <img src={item.imageUrl} alt="Story Image" className="w-32" />
                        <p className="bg-white text-black w-10 absolute top-1 left-1 rounded-xl text-center font-semibold text-[15px] ">{formatDateString(item.createdAt)} <p className="text-black font-light text-[12px]">{formatMonth(item.createdAt)}</p></p>
                        <input
                            type="checkbox"
                            className="absolute right-2 bottom-2 w-4 h-4 appearance-none border border-gray-400 rounded-full bg-transparent checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            checked={currentID === i}
                        />
                    </label>
                })}
            </div>
            <div className="w-full border-t-[1px] border-[#363636]">
                {!sendLoading ?
                    <button onClick={() => {
                        if (!editingHighlight) {
                            createHighLight(setSendLoading, userData, highlightName, selectedIDs, currentID, handleClose, setMessage, setHighlights)
                        } else {
                            editHighLight(setSendLoading, highlights, currentHighLight, userData, highLightStories, highlightName, selectedIDs, currentID, handleClose, navigate, setMessage, setHighlights)
                        }
                    }} className={`w-full py-3 text-[15px] transition-all duration-150 font-semibold  text-[#0095F6]`} >Done</button>
                    : <Loader height="15vh mt-1.5" widthHeight={false} />}
            </div>
        </div></>
}