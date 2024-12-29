import { Link, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { SettingIcon } from "../assets/Constants";
import { HighLights } from "../components/story/Highlights"
import { useEffect, useRef, useState } from "react";
import { Loader } from "../components/helpers/Loader";
import { MdVerified } from "react-icons/md";
import NoteTooltip from "../components/note/Note";
import { NoteCreator } from "../components/note/NoteCreator";
import { NoteEditor } from "../components/note/NoteEditor";
import { HighLightsModal } from "../components/story/HighLightsModal"
import { UserFollowModal } from "../components/usermodals/UserFollowModal";
import { LogOutDiv } from "../components/profile/LogOutDiv";
import { MobileProfileBar } from "../components/profile/MobileProfileBar";
import { UserFollowDetails } from "../components/usermodals/UserFollowDetails";
import { LaptopProfileBar } from "../components/profile/LaptopProfileBar";
import { fetchPosts, fetchSaves, getHighLights, getStatus } from "../services/profile";
import { fetchNote } from "../services/note";
import { ProfileButton } from "../components/profile/ProfileSettingButton";

export const Profile: React.FC = () => {
    const { userData, setUserPosts, note, setNote, setStories, stories, setCurrentStory, highlights, setHighlights, setHighLightStories, setCurrentHighLight, setUserSaves, isNoteEditOpen, setIsNoteEditOpen, isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen } = useUser();
    const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false)
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [noteLoading, setNoteLoading] = useState<boolean>(false);
    const [isCreatingHighLight, setIsCreatingHighLight] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const noteEditorRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const checkref = useRef<HTMLButtonElement>(null);

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
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsNoteEditOpen]);

    function handleClickOutside(event: any) {
        if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
            setIsNoteEditOpen(false);
        }
        if (checkref.current && dropdownRef.current && !checkref.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    return <section className="w-full lg:max-w-[58%] md:max-w-[87%] max-w-[100%] mx-auto">
        <div className="w-full max-w-[61rem] pb-9 lg:pt-20 pt-8 pl-1 sm:pl-5 md:pl-0 md:border-b-[2px] md:border-[#262626]">
            <div className="flex w-full xl:gap-20 lg:gap-5 gap-2 relative">
                <div className="cursor-pointer" onClick={() => {
                    if (note?.length === 0) {
                        setIsNoteOpen(true);
                    } else {
                        setIsNoteEditOpen(true);
                    }
                }}>
                    {!isNoteEditOpen ? <div className="absolute md:top-7 lg:top-4 xl:top-3 top-1 left-[3.5rem] sm:top-6 sm:left-[4rem] md:left-[4rem] lg:left-[5.5rem] xl:left-[9rem] z-[1]"><NoteTooltip isProfile={true} note={note} noteLoading={noteLoading} /></div> : <div ref={noteEditorRef} className="absolute md:top-2 lg:top-20 top-2 left-[22rem] md:left-[20rem] lg:left-0 xl:left-[8rem] z-[1]"><NoteEditor /></div>}
                </div>
                <Link
                    to={stories.length > 0 ? `/stories/${userData.data.user.userName}/${stories[0]._id}/` : ""}
                    className={`p-2 ${stories.length > 0 ? "relative multicolor-border" : ""} h-[6rem] sm:h-32 md:h-auto flex justify-center items-center`}
                    onClick={() => setCurrentStory(0)}
                >
                    <img
                        src={userData?.data?.user.profilePic}
                        alt="User Profile"
                        className="rounded-full w-[5rem] h-full sm:w-28 lg:w-40 lg:min-w-[10rem] min-w-[5rem] sm:h-28 lg:h-40 object-cover"
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
                        <div className="flex gap-3">
                            <ProfileButton to="/accounts/edit/" label="Edit Profile" />
                            <ProfileButton to="/archive/stories/" label="View Archive" />
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
        <NoteCreator isEditing={false} isNoteOpen={isNoteOpen} setIsNoteOpen={setIsNoteOpen} />
        <HighLightsModal isCreatingHighLight={isCreatingHighLight} setIsCreatingHighLight={setIsCreatingHighLight} />
        <UserFollowModal isFollowerModalOpen={isFollowerModalOpen} setIsFollowerModalOpen={setIsFollowerModalOpen} isFollowingModalOpen={isFollowingModalOpen} setIsFollowingModalOpen={setIsFollowingModalOpen} />
    </section>
}