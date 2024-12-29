import { IoCloseSharp } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md"
import { Loader } from "../helpers/Loader";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { fetchArchive } from "../../services/archive";
import { ProfileStories } from "../../types/stories";

interface ArchivesModalProps{
    selectStatus: boolean;
    setSelectCover: (value: boolean) => void;
    selectedIDs: any;
    selectCover: boolean;
    setSelectStatus: (value: boolean) => void;
    isCreatingHighLight: boolean;
    handleClose: () => void;
    setSelectedIDs: (value: any) => void;
    left: string
}

export const ArchivesModal: React.FC<ArchivesModalProps> = ({ selectStatus, setSelectCover, selectedIDs, selectCover, setSelectStatus, isCreatingHighLight, handleClose, setSelectedIDs, left }) => {
    const { userData } = useUser()
    const [loadingArchives, setLoadingArchives] = useState<boolean>(false)
    const [archives, setArchives] = useState<ProfileStories[]>([]);

    useEffect(() => {
        fetchArchive(setLoadingArchives, userData, setArchives)
    }, [])

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

    return <>
        <div className={`w-full md:max-w-[30rem] max-w-[25rem] overflow-hidden bg-[#262626] rounded-xl h-[76vh] 1280:h-[76vh] fixed inset-0 z-[100] top-1/2 ${left} -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-500 ${selectStatus && !selectCover ? "opacity-100" : "pointer-events-none"}`}>
            <div className="text-center w-full py-3 border-b-[1px] border-[#363636]">
                <button className="absolute text-[30px] top-2.5 left-0" onClick={() => setSelectStatus(false)}>
                    <MdKeyboardArrowLeft />
                </button>
                <p>Stories</p>
                <IoCloseSharp
                    className={`absolute text-[25px] font-extralight top-3 right-2 cursor-pointer opacity-0 transition-all duration-500 ${isCreatingHighLight ? "opacity-100" : "pointer-events-none"}`}
                    onClick={() => handleClose()}
                />
            </div>
            <div className="overflow-auto h-[65vh]">
                {!loadingArchives ?
                    <div className={`${archives.length === 0 ? "flex items-center" : ""} md:grid md:grid-cols-3 md:gap-[3px]`}>
                        {archives !== undefined && archives.length > 0 ? archives.map((item, i) => {
                            return <label key={i} className={`relative hover:opacity-50 ${selectedIDs.some((pack) => pack._id === item._id) ? "opacity-50" : ""}`} >
                                <img src={item.imageUrl} alt="Story Image" className="w-96" />
                                <p className="bg-white text-black w-12 absolute top-2 left-2 rounded-xl text-center font-semibold text-[18px] ">{formatDate(item.createdAt)} <p className="text-black font-light text-[15px]">{formatMonth(item.createdAt)}</p></p>
                                <input
                                    type="checkbox"
                                    className="absolute right-2 bottom-2 w-4 h-4 appearance-none border border-gray-400 rounded-full bg-transparent checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    checked={selectedIDs.some((pack) => pack._id === item._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIDs((prev) => [...prev, item])
                                        } else {
                                            setSelectedIDs((prev) => prev.filter((pack) => pack._id !== item._id))
                                        }
                                    }}
                                />
                            </label>
                        }) : <div className="text-[#8e8e8e] h-[63vh] text-center w-[25rem] md:w-[30rem] mx-auto">
                            <p>No items found in this archive.</p>
                            <p className="text-[#a2a2a2]">Start adding some stories to see them here!</p>
                        </div>}
                    </div>
                    : <div className="h-[64vh]"><Loader /> </div>}
            </div>
            <div className="w-full border-t-[1px] border-[#363636]">
                <button className={`w-full py-3 text-[15px] transition-all duration-150 font-semibold ${selectedIDs.length > 0 ? "text-[#0095F6]" : "text-[#A8A8A8] "}`} disabled={selectedIDs.length === 0} onClick={() => setSelectCover(true)}>Next</button>
            </div>
        </div></>
}