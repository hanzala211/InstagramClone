import { useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5"
import { SelectedHighLights } from "./SelectedHighLights";
import { ArchivesModal } from "../archives/ArchivesModal";
import { ProfileStories } from "../../types/stories";

interface HighLightsModalProps {
    isCreatingHighLight: boolean;
    setIsCreatingHighLight: (value: boolean) => void;
}

export const HighLightsModal: React.FC<HighLightsModalProps> = ({ setIsCreatingHighLight, isCreatingHighLight }) => {
    const [highlightName, setHighlightName] = useState<string>("");
    const [selectStatus, setSelectStatus] = useState<boolean>(false);
    const [selectedIDs, setSelectedIDs] = useState<ProfileStories[]>([]);
    const [currentID, setCurrentID] = useState<number>(0)
    const [selectCover, setSelectCover] = useState<boolean>(false);
    const [sendLoading, setSendLoading] = useState<boolean>(false)

    useEffect(() => {
        const body: any = document.querySelector("body");
        body.style.overflow = selectStatus ? "hidden" : "auto";
        return () => {
            body.style.overflow = "auto"
        }
    }, [selectStatus])

    function handleClose() {
        setIsCreatingHighLight(false)
        setSelectStatus(false)
        setSelectCover(false)
        setSelectedIDs([])
        setHighlightName("")
    }

    return <>
        <div
            className={`overlay opacity-0 z-[50] transition-all duration-500 ${!isCreatingHighLight ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div className={`fixed inset-0 z-50 top-[50%] -translate-y-1/2 left-1/2 md:left-[55%] -translate-x-1/2 w-[80%] md:w-[30%] h-[19%] ${isCreatingHighLight && !selectStatus ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-500`}>
            <div className="bg-[#262626] w-full max-w-[400px] rounded-xl">
                <div className="text-center w-full py-3 border-b-[1px] border-[#363636] relative">
                    <p>New highlight</p>
                    <IoCloseSharp
                        className={`absolute text-[25px] font-extralight top-2 right-2 z-[100000] cursor-pointer opacity-0 transition-all duration-500 ${isCreatingHighLight ? "opacity-100" : "pointer-events-none"}`}
                        onClick={handleClose}
                    />
                </div>
                <div className="w-full flex justify-center py-5 px-5 border-b-[1px] border-[#363636]">
                    <input
                        type="text"
                        placeholder="Highlight name"
                        className="bg-[#121212] w-full p-2 rounded-sm outline-none placeholder:text-[#737373] placeholder:text-[14px]"
                        value={highlightName}
                        onChange={(e) => {
                            setHighlightName(e.target.value)
                        }}
                    />
                </div>
                <div className="w-full px-5">
                    <button className={`w-full py-3 text-[15px] transition-all duration-150 font-semibold ${highlightName.length > 0 ? "text-[#0095F6]" : "text-[#A8A8A8]"}`}
                        disabled={highlightName.length === 0}
                        onClick={() => setSelectStatus(true)}>Next</button>
                </div>
            </div>
        </div>

        <ArchivesModal selectStatus={selectStatus} setSelectCover={setSelectCover} selectedIDs={selectedIDs} selectCover={selectCover} setSelectStatus={setSelectStatus} isCreatingHighLight={isCreatingHighLight} handleClose={handleClose} setSelectedIDs={setSelectedIDs} left="left-1/2" />

        <SelectedHighLights selectCover={selectCover} setSelectCover={setSelectCover} setSelectedIDs={setSelectedIDs} isCreatingHighLight={isCreatingHighLight} handleClose={handleClose} selectedIDs={selectedIDs} currentID={currentID} setSendLoading={setSendLoading} highlightName={highlightName} sendLoading={sendLoading} setCurrentID={setCurrentID} />
    </>
}