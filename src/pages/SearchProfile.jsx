import { MdVerified } from "react-icons/md";
import NoteTooltip from "../components/Note";
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch, useUser } from "../context/UserContext";
import { Loader } from "../components/Loader";
import { MobilePostIcon, PostsIcon } from "../assets/Constants";
import { HighLights } from "../components/Highlights";
import { LoadingPage } from "./LoadingPage";
import { formatNumber } from "../utils/helper";

export function SearchProfile() {
    const { setSearchUserPosts, selectedProfile, searchUserStatus, setSearchUserStatus, searchUserHighLights, setSearchUserHighLights, setSelectedProfile } = useSearch();
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
        Promise.all(selectedProfile?.posts.map((item) => fetchPosts(item))).then((res) => {
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

    async function fetchPosts(postID) {
        try {
            setPostsLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/${postID}`, {
                method: "GET",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            return await result;
        } catch (error) {
            console.error(error)
        }
    }

    async function followUser() {
        try {
            setUserData((prev) => ({
                ...prev, data: {
                    ...prev.data, user: {
                        ...prev.data.user, following: [...prev.data.user.following, selectedProfile?._id], followingCount: prev.data.user.followingCount + 1
                    }
                }
            }))
            setIsDisabled(true)
            setSelectedProfile((prev) => ({
                ...prev, followersCount: prev.followersCount + 1
            }))
            setIsDisabled(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/follow/${selectedProfile._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false)
            setMessage("User Followed Successfully")
        }
    }

    async function unfollowUser() {
        try {
            setUserData((prev) => ({
                ...prev, data: {
                    ...prev.data, user: {
                        ...prev.data.user, following: [prev.data.user.following.filter((item) => item !== selectedProfile._id)], followingCount: prev.data.user.followingCount - 1
                    }
                }
            }))
            setIsDisabled(true)
            setSelectedProfile((prev) => ({
                ...prev, followersCount: prev.followersCount - 1
            }))
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/unfollow/${selectedProfile._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false)
            setMessage("User Unfollowed Successfully")
        }
    }

    return <>
        {!mainLoading ?
            <section className="w-full lg:max-w-[60%] mx-auto">
                <div className="w-full max-w-[61rem] pb-9 lg:pt-20 pt-5 md:border-b-[2px] md:border-[#262626]">
                    <div className="flex w-full xl:gap-20 lg:gap-5 gap-3 ml-3 items-center relative">
                        {searchUserNotes.length > 0 &&
                            <div className="absolute md:top-5 lg:-top-1 top-2 left-[8%] md:left-[6%] xl:left-[15%] lg:left-[10%] cursor-pointer">
                                <NoteTooltip isProfile={true} note={searchUserNotes[0]} />
                            </div>
                        }
                        <Link to={searchUserStatus.length > 0 ? `/search/stories/${selectedProfile.userName}/${searchUserStatus[0]._id}/` : ""}
                            className={`p-2 ${searchUserStatus.length > 0 ? "relative rounded-full multicolor-border" : ""}`}
                            onClick={() => setCurrentStory(0)}>
                            <img src={selectedProfile.profilePic} alt="User Profile" className="rounded-full w-20 sm:w-28 lg:w-40 md:min-w-[6rem] min-w-[3rem]" />
                        </Link>
                        <div className="flex flex-col gap-6 mt-6 xl:mt-0">
                            <div className="flex md:flex-row flex-col gap-6 md:items-center">
                                <Link className="text-[20px] flex items-center gap-1">
                                    {selectedProfile.userName}
                                    {selectedProfile?.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                                </Link>
                                <div>
                                    {isFollowed ?
                                        <button disabled={isDisabled} className={`bg-[#363636] px-7 py-1 rounded-lg sm:w-32 1280:w-auto ${isDisabled ? "opacity-50" : ""}`} onClick={() => unfollowUser()}>Unfollow</button>
                                        :
                                        <button disabled={isDisabled} className={`bg-[#0095F6] px-7 py-1 rounded-lg ${isDisabled ? "opacity-50" : ""}`} onClick={() => followUser()}>Follow</button>
                                    }
                                </div>
                            </div>
                            <div className="md:flex hidden gap-10 items-center">
                                <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.postCount)}</span>posts</p>
                                <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.followersCount)}</span>followers</p>
                                <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.followingCount)}</span>following</p>
                            </div>
                            <div>
                                <p className="font-semibold text-[14px]">{selectedProfile.fullName}</p>
                                <p className="font-semibold text-[14px] text-[#a8a8a8] w-[200px] break-words">{selectedProfile.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex gap-10 ml-5 md:mt-16 mt-5 ${searchUserHighLights.length === 0 ? "" : "md:h-36 h-24"} overflow-x-auto scrollbar-hidden`}>
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
                    <p className="flex mr-10 flex-col items-center gap-0.5 w-[33%]"><span className="font-semibold">{formatNumber(userData.data.user.postCount)}</span><span className="text-[13px] text-[#a8a8a8]">posts</span></p>
                    <button className="flex mr-10 flex-col items-center gap-0.5 w-[33%]"><span className="font-semibold">{formatNumber(userData.data.user.followersCount)}</span><span className="text-[13px] text-[#a8a8a8]">followers</span></button>
                    <button className="flex flex-col items-center gap-0.5 w-[33%]"><span className="font-semibold">{formatNumber(userData.data.user.followingCount)}</span><span className="text-[13px] text-[#a8a8a8]">following</span></button>
                </div>
                <div className="absolute left-[57%] -translate-x-1/2 md:flex hidden gap-10">
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