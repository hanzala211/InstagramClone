import { IoCloseSharp } from "react-icons/io5";
import { useSearch, useUser } from "../context/UserContext"
import { Link, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MoreSVG } from "../assets/Constants";
import { useState } from "react";
import { HighlightsEditor } from "../components/story/HighlightsEditor";
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

    return <section className="bg-[#1A1A1A] w-full h-screen relative p-4 flex flex-col md:flex-row justify-between items-start">
        <img
            src="/images/instagramiconswhite.png"
            alt="Instagram Icon"
            className="w-20 md:w-28 mb-4 md:mb-0"
        />
        <div className="w-full md:w-[32rem] rounded-xl relative">
            <div className="absolute left-0 md:left-auto px-5 top-[1rem] md:top-4 md:px-3 w-full md:w-[32rem]">
                <div className="w-full flex gap-1.5">
                    {isOwnProfile ? stories.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : isArchive ? archives.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : isHighLight ? highLightStories.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : isSearchUser ? searchUserStatus.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : isSearchHighLight ? searchUserHighLights.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    )) : ""}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={isArchive || isOwnProfile || isHighLight ? userData.data.user.profilePic : isSearchUser || isSearchHighLight ? selectedProfile.profilePic : ""}
                            className="w-9 md:w-11 rounded-full"
                            alt="profilePic"
                        />
                        <div className="flex flex-col gap-0.5">
                            <Link
                                to={isArchive || isOwnProfile || isHighLight ? `/${userData.data.user.userName}/` : isSearchUser || isSearchHighLight ? `/search/${selectedProfile?.userName}/` : ""}
                                className="font-semibold text-[12px] md:text-[14px] flex items-center gap-1">
                                {isArchive || isOwnProfile || isHighLight ? userData.data.user.userName : isSearchUser || isSearchHighLight ? selectedProfile.userName : ""}
                                {isOwnProfile || isArchive || isHighLight ? userData.data.user.followingCount > 10 && <MdVerified className="fill-white" /> : isSearchUser || isSearchHighLight ? selectedProfile.followingCount > 10 && <MdVerified className="fill-white" /> : ""}
                            </Link>
                            <p className="text-[#A2A2A2] text-[10px] md:text-[11px] font-semibold">
                                {isOwnProfile ? formatDate(stories[currentStory].createdAt) : isArchive ? formatDate(archives[currentStory]?.createdAt) : isHighLight ? formatDate(highLightStories[currentStory]?.createdAt) : isSearchUser ? formatDate(searchUserStatus[currentStory]?.createdAt) : isSearchHighLight ? searchUserHighLights[currentStory]?.createdAt : ""} ago
                            </p>
                        </div>
                    </div>
                    {isHighLight && (
                        <button onClick={() => setHighLightsModal(true)}>
                            <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
                        </button>
                    )}
                </div>
            </div>
            <img
                src={isOwnProfile ? stories[currentStory]?.imageUrl : isArchive ? archives[currentStory]?.imageUrl : isHighLight || isSearchHighLight ? highLightStories[currentStory]?.imageUrl : isSearchUser ? searchUserStatus[currentStory]?.imageUrl : ""}
                alt="Story"
                className="w-full rounded-xl"
            />
            {(isOwnProfile
                ? stories.length > 1
                : isArchive
                    ? archives.length > 1
                    : isHighLight
                        ? highLightStories.length > 1
                        : isSearchUser
                            ? searchUserStatus.length > 1
                            : isSearchHighLight
                                ? searchUserHighLights.length > 1
                                : "") && (
                    <>
                        {(isOwnProfile
                            ? currentStory !== stories.length - 1
                            : isArchive
                                ? currentStory !== archives.length - 1
                                : isHighLight
                                    ? currentStory !== highLightStories.length - 1
                                    : isSearchUser
                                        ? currentStory !== searchUserStatus.length - 1
                                        : isSearchHighLight
                                            ? currentStory !== searchUserHighLights.length - 1
                                            : "") && (
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                                    onClick={handleIncrease}
                                >
                                    <FaArrowRight className="fill-black text-lg" />
                                </button>
                            )}
                        {currentStory !== 0 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                                onClick={handleDecrease}
                            >
                                <FaArrowLeft className="fill-black text-lg" />
                            </button>
                        )}
                    </>
                )}
        </div>
        <button
            onClick={() => {
                navigate(-1);
                setCurrentStory(0);
            }}
        >
            <IoCloseSharp className="text-[28px] md:text-[35px] absolute top-3 right-3" />
        </button>
        <HighlightsEditor highLightsModal={highLightsModal} setHighLightsModal={setHighLightsModal} />
    </section>

}