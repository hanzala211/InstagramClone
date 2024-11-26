import { IoCloseSharp } from "react-icons/io5";
import { useSearch, useUser } from "../context/UserContext"
import { Link, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MoreSVG } from "../assets/Constants";
import { useState } from "react";
import { HighlightsEditor } from "../components/HighlightsEditor";
import { formatDate } from "../utils/helper";

export function Story({ isArchive, isOwnProfile, isHighLight, isSearchUser, isSearchHighLight }) {
    const { stories, userData, archives, setCurrentStory, currentStory, highLightStories } = useUser();
    const { searchUserStatus, selectedProfile, searchUserHighLights } = useSearch()
    const [highLightsModal, setHighLightsModal] = useState(false)
    const navigate = useNavigate();

    function handleIncrease() {
        setCurrentStory((prev) => prev + 1);
    }

    function handleDecrease() {
        setCurrentStory((prev) => prev - 1);
    }

    return <section className="bg-[#1A1A1A] relative w-[100vw] h-[100vh] p-4 flex justify-between flex-row items-start">
        <img src="/images/instagramiconswhite.png" alt="Instagram Icon" className="w-28" />
        <div className="w-[32rem] rounded-xl">
            <div className="absolute top-7 px-3 w-[32rem]">
                <div className="w-full flex gap-1.5">
                    {isOwnProfile ? stories.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : isArchive ? archives.map((item, i) => <div
                        key={i}
                        className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                    ></div>) : isHighLight ? highLightStories.map((item, i) => <div
                        key={i}
                        className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                    ></div>) : isSearchUser ? searchUserStatus.map((item, i) => <div
                        key={i}
                        className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                    ></div>)
                        : isSearchHighLight ? searchUserHighLights.map((item, i) => <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>) : ""}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 mt-3">
                        <img src={isArchive || isOwnProfile || isHighLight ? userData.data.user.profilePic : isSearchUser || isSearchHighLight ? selectedProfile.profilePic : ""} className="w-11 rounded-full" alt="profilePic" />
                        <div className="flex flex-col gap-0.5">
                            <Link to={isArchive || isOwnProfile || isHighLight ? `/${userData.data.user.userName}/` : isSearchUser || isSearchHighLight ? `/search/${selectedProfile?.userName}/` : ""} className="font-semibold text-[14px] flex items-center gap-1">{isArchive || isOwnProfile || isHighLight ? userData.data.user.userName : isSearchUser || isSearchHighLight ? selectedProfile.userName : ""}
                                {isOwnProfile || isArchive || isHighLight ? userData.data.user.followingCount > 10 && <MdVerified className="fill-white" /> : isSearchUser || isSearchHighLight ? selectedProfile.followingCount > 10 && <MdVerified className="fill-white" /> : ""}
                            </Link>
                            <p className="text-[#A2A2A2] text-[11px] font-semibold">{isOwnProfile ? formatDate(stories[currentStory].createdAt) : isArchive ? formatDate(archives[currentStory].createdAt) : isHighLight ? formatDate(highLightStories[currentStory].createdAt) : isSearchUser ? formatDate(searchUserStatus[currentStory].createdAt) : isSearchHighLight ? searchUserHighLights[currentStory].createdAt : ""} ago</p>
                        </div>
                    </div>
                    {isHighLight && <button onClick={() => setHighLightsModal(true)}>
                        <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
                    </button>}
                </div>
            </div>
            <img src={isOwnProfile ? stories[currentStory]?.imageUrl : isArchive ? archives[currentStory]?.imageUrl : isHighLight || isSearchHighLight ? highLightStories[currentStory]?.imageUrl : isSearchUser ? searchUserStatus[currentStory]?.imageUrl : ""} alt="Story" className="w-full rounded-xl" />
        </div>
        <button onClick={() => {
            navigate(-1)
            setCurrentStory(0);
        }}>
            <IoCloseSharp className="text-[35px]" />
        </button>
        {(isOwnProfile ? stories.length > 1 : isArchive ? archives.length > 1 : isHighLight ? highLightStories.length > 1 : isSearchUser ? searchUserStatus.length > 1 : isSearchHighLight ? searchUserHighLights.length > 1 : "") ? <> {(isOwnProfile ? currentStory !== stories.length - 1 : isArchive ? currentStory !== archives.length - 1 : isHighLight ? currentStory !== highLightStories.length - 1 : isSearchUser ? currentStory !== searchUserStatus.length - 1 : isSearchHighLight ? currentStory !== searchUserHighLights.length - 1 : "") && <button className="absolute right-[38rem] top-1/2 -translate-y-[20%] p-2 bg-white rounded-full" onClick={handleIncrease}><FaArrowRight className="fill-black" /></button>}
            {currentStory !== 0 && <button className="absolute left-[43rem] top-1/2 -translate-y-[50%] p-2 bg-white rounded-full" onClick={handleDecrease}><FaArrowLeft className="fill-black" /></button>}
        </> : ""}
        <HighlightsEditor highLightsModal={highLightsModal} setHighLightsModal={setHighLightsModal} />
    </section>
}