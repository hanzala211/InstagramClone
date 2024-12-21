import { MdVerified } from "react-icons/md";
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch, useUser } from "../context/UserContext";
import { Loader } from "../components/helpers/Loader";
import { MobilePostIcon, PostsIcon } from "../assets/Constants";
import { HighLights } from "../components/story/Highlights";
import { LoadingPage } from "./LoadingPage";
import { UserFollowDetails } from "../components/usermodals/UserFollowDetails";
import { NoteDiv } from "../components/note/NoteDiv";
import { followUser, unfollowUser, fetchPosts } from "../services/searchProfile";
import { useChat } from "../context/ChatContext";

export function SearchProfile() {
    const { setSearchUserPosts, selectedProfile, searchUserStatus, setSearchUserStatus, searchUserHighLights, setSearchUserHighLights, setSelectedProfile } = useSearch();
    const { setSelectedChat } = useChat()
    const { userData, setUserData, setHighLightStories, setCurrentHighLight, setCurrentStory, mainLoading, setMessage } = useUser()
    const [postsLoading, setPostsLoading] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [searchUserNotes, setSearchUserNotes] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (params.username === userData?.data.user.userName) {
            navigate(`/${userData.data.user.userName}/`)
        }
    }, [params.username, userData?.data.user.userName, navigate])

    useEffect(() => {
        if (userData?.data.user.following) {
            setIsFollowed(userData.data.user.following.includes(selectedProfile?._id))
        }
    }, [selectedProfile._id, userData.data.user.following])

    useEffect(() => {
        Promise.all(selectedProfile?.posts.map((item) => fetchPosts(item, setPostsLoading, userData))).then((res) => {
            setSearchUserPosts(res.map((item) => item.post))
        }).finally(() => setPostsLoading(false))
    }, [selectedProfile.posts, userData.data.token])

    useEffect(() => {
        if (selectedProfile?.highlights) {
            setSearchUserHighLights(selectedProfile.highlights);
        }
        if (selectedProfile?.stories) {
            setSearchUserStatus(selectedProfile.stories)
        }
        if (selectedProfile?.notes) {
            setSearchUserNotes(selectedProfile.notes)
        }
    }, [selectedProfile])

    return <>
        {!mainLoading ?
            <section className="w-full lg:max-w-[57%] md:max-w-[87%] mx-auto">
                <div className="w-full max-w-[61rem] pb-9 lg:pt-20 pt-8 md:border-b-[2px] md:border-[#262626]">
                    <div className="flex w-full xl:gap-20 lg:gap-5 gap-2 sm:items-center relative">
                        {searchUserNotes.length > 0 &&
                            <NoteDiv notes={searchUserNotes[0]} />
                        }
                        <Link to={searchUserStatus.length > 0 ? `/search/stories/${selectedProfile.userName}/${searchUserStatus[0]._id}/` : ""}
                            className={`p-2 ${searchUserStatus.length > 0 ? "relative rounded-full multicolor-border h-[5.9rem] sm:h-32 md:h-auto" : ""}`}
                            onClick={() => setCurrentStory(0)}>
                            <img src={selectedProfile.profilePic} alt="User Profile" className="rounded-full w-20 sm:w-28 lg:w-40 md:min-w-[7rem] min-w-[3rem]" />
                        </Link>
                        <div className="flex flex-col gap-2 sm:gap-5 mt-2 xl:mt-0">
                            <div className="flex md:flex-row flex-col gap-3 sm:gap-6 md:items-center">
                                <Link className="text-[20px] flex items-center gap-1">
                                    {selectedProfile.userName}
                                    {selectedProfile?.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                                </Link>
                                <div className="flex gap-3">
                                    {isFollowed ?
                                        <button disabled={isDisabled} className={`bg-[#363636] px-7 py-1 rounded-lg sm:w-32 1280:w-auto ${isDisabled ? "opacity-50" : ""}`} onClick={() => unfollowUser(setUserData, selectedProfile, setIsDisabled, setSelectedProfile, userData, setMessage)}>Unfollow</button>
                                        :
                                        <button disabled={isDisabled} className={`bg-[#0095F6] px-7 py-1 rounded-lg ${isDisabled ? "opacity-50" : ""}`} onClick={() => followUser(setUserData, selectedProfile, setIsDisabled, setSelectedProfile, setMessage, userData)}>Follow</button>
                                    }
                                    <button onClick={() => {
                                        setSelectedChat(selectedProfile)
                                        navigate("/direct/inbox/")
                                    }} className={`bg-[#0095F6] px-7 py-1 rounded-lg`}>Message</button>
                                </div>
                            </div>
                            <div className="md:flex hidden gap-10 items-center">
                                <UserFollowDetails isSearchProfile={true} />
                            </div>
                            <div className="relative -left-[5.5rem] top-3 sm:left-0 sm:top-0">
                                <p className="font-semibold text-[14px]">{selectedProfile.fullName}</p>
                                <p className="font-semibold text-[14px] text-[#a8a8a8] w-[200px] break-words">{selectedProfile.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex gap-10 ml-5 md:mt-16 mt-7 ${searchUserHighLights.length === 0 ? "h-24" : "md:h-36 h-24"} overflow-x-auto scrollbar-hidden`}>
                        {searchUserHighLights.length > 0 && searchUserHighLights.map((item, i, arr) =>
                            <Link to={`/search/stories/highlight/${arr[i]._id}/`} key={i} onClick={() => {
                                setHighLightStories(searchUserHighLights[i].stories)
                                setCurrentStory(0)
                                setCurrentHighLight(i)
                            }}>
                                <HighLights title={item.name} image={item.profilePic} />
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex justify-evenly py-2 border-y-[1px] border-[#262626] md:hidden">
                    <UserFollowDetails isSearchProfile={true} />
                </div>
                <div className="absolute left-[58%] xl:left-[55.5%] -translate-x-1/2 md:flex hidden gap-10">
                    <NavLink end to={`/search/${selectedProfile.userName}/`}
                        className={({ isActive }) => `flex items-center tracking-wider py-3 gap-1 text-[12px] ${isActive ? "font-semibold border-t-[2px]" : "text-[#A8A8A8]"}`}>
                        <PostsIcon /> POSTS
                    </NavLink>
                </div>
                <div className="flex md:hidden justify-center border-b-[1px] border-[#262626] gap-10">
                    <NavLink end to={`/search/${selectedProfile.userName}/`}
                        className={({ isActive }) => `flex w-[35%] items-center justify-center tracking-wider py-3 gap-1 ${isActive ? "font-semibold border-t-[2px]" : "text-[#A8A8A8]"}`}>
                        <MobilePostIcon />
                    </NavLink>
                </div>
                <div className="md:mt-[4rem] mt-6">
                    {!postsLoading ? <Outlet /> : <Loader height="h-[34vh]" />}
                </div>
            </section>
            : <LoadingPage />}
    </>
}