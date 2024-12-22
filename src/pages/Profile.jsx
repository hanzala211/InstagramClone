import { Link, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext"
import { SettingIcon } from "../assets/Constants";
import { HighLights } from "../components/story/Highlights";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../components/helpers/Loader";
import { MdVerified } from "react-icons/md";
import { ProfileSettings } from "../components/profile/ProfileSettings";
import NoteTooltip from "../components/note/Note";
import { NoteCreator } from "../components/note/NoteCreator";
import { NoteEditor } from "../components/note/NoteEditor";
import { HighLightsModal } from "../components/story/HighLightsModal";
import { UserFollowModal } from "../components/usermodals/UserFollowModal";
import { LogOutDiv } from "../components/profile/LogOutDiv";
import { MobileProfileBar } from "../components/profile/MobileProfileBar";
import { UserFollowDetails } from "../components/usermodals/UserFollowDetails";
import { LaptopProfileBar } from "../components/profile/LaptopProfileBar";
import { fetchPosts, fetchSaves, getHighLights, getStatus } from "../services/profile";
import { fetchNote } from "../services/note";

export function Profile() {
    const { userData, setUserPosts, note, setNote, setStories, stories, setCurrentStory, highlights, setHighlights, setHighLightStories, setCurrentHighLight, setUserSaves, isNoteEditOpen, setIsNoteEditOpen, isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen } = useUser();
    const [isNoteOpen, setIsNoteOpen] = useState(false)
    const [postsLoading, setPostsLoading] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [noteLoading, setNoteLoading] = useState(false);
    const [isCreatingHighLight, setIsCreatingHighLight] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const noteEditorRef = useRef(null);
    const dropdownRef = useRef(null);
    const checkref = useRef(null);

    useEffect(() => {
        fetchPosts(setPostsLoading, userData, setUserPosts);
        fetchSaves(userData, setUserSaves);
        fetchNote(setNoteLoading, userData, setNote);
        getStatus(userData, setStories);
        if (highlights.length === 0) {
            getHighLights(setHighLightStories, userData, setHighlights)
        }
    }, [])

    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isEditOpen ? "hidden" : "auto";

        return () => body.style.overflowY = "auto"
    }, [isEditOpen])

    useEffect(() => {
        function handleClickOutside(event) {
            if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
                setIsNoteEditOpen(false);
            }
            if (checkref.current && dropdownRef.current && !checkref.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsNoteEditOpen]);

    return <section className="w-full lg:max-w-[57%] md:max-w-[87%] mx-auto">
        <div className="w-full max-w-[61rem] pb-9 lg:pt-20 pt-8 md:border-b-[2px] md:border-[#262626]">
            <div className="flex w-full xl:gap-20 lg:gap-5 gap-2 sm:items-center relative">
                <div className="cursor-pointer" onClick={() => {
                    if (note.length === 0) {
                        setIsNoteOpen(true);
                    } else {
                        setIsNoteEditOpen(true);
                    }
                }}>
                    {!isNoteEditOpen ? <div className="absolute md:top-7 lg:top-4 xl:top-3 top-1 left-[2.5rem] sm:top-6 sm:left-[4rem] md:left-[4rem] lg:left-[5.5rem] xl:left-[9rem] z-[1]"><NoteTooltip isProfile={true} note={note} noteLoading={noteLoading} /></div> : <div ref={noteEditorRef} className="absolute md:top-2 lg:top-20 top-2 left-[22rem] md:left-[20rem] lg:left-0 xl:left-[8rem] z-[1]"><NoteEditor /></div>}
                </div>
                <Link
                    to={stories.length > 0 ? `/stories/${userData.data.user.userName}/${stories[0]._id}/` : ""}
                    className={`p-2 ${stories.length > 0 ? "relative rounded-full multicolor-border h-[5.8rem] sm:h-32 md:h-auto" : ""} flex justify-center items-center`}
                    onClick={() => setCurrentStory(0)}
                >
                    <img
                        src={userData?.data?.user.profilePic}
                        alt="User Profile"
                        className="rounded-full w-[5rem] sm:w-28 lg:w-40 lg:min-w-[7rem] min-w-[3rem]  sm:h-28 lg:h-40 object-cover"
                    />
                </Link>
                <div className="flex flex-col gap-4 sm:gap-6 mt-2 xl:mt-0 relative ">
                    <div className="flex gap-4 sm:gap-6 md:flex-row flex-col md:items-center">
                        <p className="text-[20px] relative flex items-center gap-1">{userData?.data?.user.userName}
                            {userData !== undefined && userData?.data.user.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                            <button className="block md:hidden" ref={checkref} onClick={() => setIsOpen((prev) => !prev)}>
                                <SettingIcon className="w-5" />
                            </button>
                            <LogOutDiv isOpen={isOpen} dropdownRef={dropdownRef} isMobile={true} />
                        </p>
                        <div className="flex gap-3 flex-row 440:items-center">
                            <button className="bg-[#363636] md:px-4 py-1 w-24 440:w-32 1280:w-auto rounded-[0.5rem] text-[14px] hover:bg-[rgb(38,38,38)] transition duration-150" onClick={() => setIsEditOpen(true)}>Edit Profile</button>
                            <Link to="/archive/stories/" className="bg-[#363636] w-32 440:w-32 1280:w-auto px-5 py-1 rounded-[0.5rem] text-[14px] flex justify-center hover:bg-[rgb(38,38,38)] transition duration-150">View Archive</Link>
                        </div>
                    </div>
                    <div className="md:flex hidden gap-10 items-center">
                        <UserFollowDetails />
                    </div>
                    <div className="relative -left-[5.5rem] top-3 sm:left-0 sm:top-0">
                        <p className="font-semibold text-[14px]">{userData.data.user.fullName}</p>
                        <p className="font-semibold text-[14px] text-[#a8a8a8] w-[200px] break-words">{userData.data.user.bio}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-10 ml-5 md:mt-16 mt-8 md:h-36 h-24 overflow-x-auto scrollbar-hidden">
                {highlights.length > 0 && highlights.map((item, i, arr) => (
                    <Link to={`/stories/highlight/${arr[i]._id}/`} key={i} onClick={() => {
                        setHighLightStories(highlights[i].stories);
                        setCurrentStory(0);
                        setCurrentHighLight(i);
                    }}>
                        <HighLights title={item.name} image={item.profilePic} />
                    </Link>
                ))}
                <HighLights title="New" onClick={() => setIsCreatingHighLight(true)} />
            </div>
        </div>
        <LaptopProfileBar />
        <div className="flex  justify-evenly py-2 border-y-[1px] border-[#262626] md:hidden">
            <UserFollowDetails />
        </div>
        <MobileProfileBar />
        <div className="md:mt-[4rem] mt-6">
            {!postsLoading ? <Outlet /> : <Loader height="h-[22vh] 1280:h-[34vh]" />}
        </div>
        <ProfileSettings userData={userData} isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
        <NoteCreator isEditing={false} isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} />
        <HighLightsModal isCreatingHighLight={isCreatingHighLight} setIsCreatingHighLight={setIsCreatingHighLight} />
        <UserFollowModal isFollowerModalOpen={isFollowerModalOpen} setIsFollowerModalOpen={setIsFollowerModalOpen} isFollowingModalOpen={false} />
        <UserFollowModal isFollowingModalOpen={isFollowingModalOpen} setIsFollowingModalOpen={setIsFollowingModalOpen} isFollowerModalOpen={false} />
    </section>
}