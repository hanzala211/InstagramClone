import { useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5"
import { useUser } from "../context/UserContext"
import { ArchivesModal } from "./ArchivesModal";
import { SelectedHighLights } from "./SelectedHighLights";


export function HighLightsModal({ setIsCreatingHighLight, isCreatingHighLight }) {
    const { userData } = useUser()
    const [highlightName, setHighlightName] = useState("");
    const [selectStatus, setSelectStatus] = useState(false);
    const [selectedIDs, setSelectedIDs] = useState([]);
    const [currentID, setCurrentID] = useState(0)
    const [selectCover, setSelectCover] = useState(false);
    const [sendLoading, setSendLoading] = useState(false)

    useEffect(() => {
        const body = document.querySelector("body");
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
    async function createHighLight() {
        try {
            setSendLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/highlights`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": highlightName
                }),
                redirect: 'follow'
            })
            const result = await response.json();
            if (result.message === "Highlight created successfully.") {
                async function sendStories(storyID) {
                    const addStory = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/highlights/${result.highlight._id}/add`, {
                        method: "POST",
                        headers: {
                            "Authorization": `${userData.data.token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "storyId": storyID
                        }),
                        redirect: "follow"
                    })
                    return addStory.json();
                }
                Promise.all(selectedIDs.map((item) => sendStories(item._id)))
                async function postProfile() {
                    const formData = new FormData();
                    const blobImage = await fetch(selectedIDs[currentID].imageUrl).then((req) => req.blob());
                    formData.append("image", blobImage, "profileImage")
                    try {
                        const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/highlights/${result.highlight._id}/profile-pic`, {
                            method: "POST",
                            headers: {
                                "Authorization": `${userData.data.token}`
                            },
                            body: formData,
                            redirect: "follow"
                        })
                        const postResult = await response.json();
                    } catch (error) {
                        console.error(error);
                    }
                }
                postProfile();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSendLoading(false)
            handleClose();
        }
    }

    function formatDate(num) {
        const date = new Date(num);
        const day = date.getDate();
        return `${day}`
    }

    function formatMonth(num) {
        const date = new Date(num);
        const month = date.toLocaleString('default', { month: "short" });
        return `${month} `
    }

    return <>
        <div
            className={`overlay opacity-0 z-[50] transition-all duration-500 ${!isCreatingHighLight ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div className={`fixed inset-0 z-50 top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 w-[70%] md:w-[30%] h-[19%] ${isCreatingHighLight && !selectStatus ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-500`}>
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
                        onChange={(e) => setHighlightName(e.target.value)}
                    />
                </div>
                <div className="w-full px-5">
                    <button
                        className={`w-full py-3 text-[15px] transition-all duration-150 font-semibold ${highlightName.length > 0 ? "text-[#0095F6]" : "text-[#A8A8A8]"}`}
                        disabled={highlightName.length === 0}
                        onClick={() => setSelectStatus(true)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <ArchivesModal selectStatus={selectStatus} setSelectCover={setSelectCover} selectedIDs={selectedIDs} selectCover={selectCover} setSelectStatus={setSelectStatus} isCreatingHighLight={isCreatingHighLight} handleClose={handleClose} setSelectedIDs={setSelectedIDs} left="left-1/2" />
        <SelectedHighLights selectCover={selectCover} setSelectCover={setSelectCover} setSelectedIDs={setSelectedIDs} isCreatingHighLight={isCreatingHighLight} handleClose={handleClose} selectedIDs={selectedIDs} formatDate={formatDate} formatMonth={formatMonth} currentID={currentID} createHighLight={createHighLight} sendLoading={sendLoading} setCurrentID={setCurrentID} />
    </>
}