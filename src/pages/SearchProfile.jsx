import { MdVerified } from "react-icons/md";
import NoteTooltip from "../components/Note";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearch, useUser } from "../context/UserContext";
import { Loader } from "../components/Loader";
import { PostsIcon, TaggedUser } from "../assets/Constants";
import { HighLights } from "../components/Highlights";


export function SearchProfile() {
    const [postsLoading, setPostsLoading] = useState(false);
    const { setSearchUserPosts, selectedProfile, searchUserStatus, setSearchUserStatus, searchUserHighLights, setSearchUserHighLights } = useSearch();
    const { userData, setUserData, setHighLightStories, setCurrentHighLight, setCurrentStory } = useUser()
    const [isFollowed, setIsFollowed] = useState(false);
    const [searchUserNotes, setSearchUserNotes] = useState([])
    useEffect(() => {
        if (userData?.data.user.following) {
            setIsFollowed(userData.data.user.following.includes(selectedProfile?._id))
        }
    }, [selectedProfile._id, userData.data.user.following])
    useEffect(() => {
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
                return result.data;
            } catch (error) {
                console.error(error)
            }
        }
        Promise.all(selectedProfile?.posts.map((item) => fetchPosts(item))).then(res => setSearchUserPosts(res)).finally(() => setPostsLoading(false))
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
    async function followUser() {
        try {
            setUserData((prev) => ({
                ...prev, data: {
                    ...prev.data, user: {
                        ...prev.data.user, following: [...prev.data.user.following, selectedProfile?._id]
                    }
                }
            }))
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
        }
    }
    async function unfollowUser() {
        try {
            setUserData((prev) => ({
                ...prev, data: {
                    ...prev.data, user: {
                        ...prev.data.user, following: [prev.data.user.following.filter((item) => item !== selectedProfile._id)]
                    }
                }
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
        }
    }
    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1) + 'B';
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1) + ' M';
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }
    return <section className="w-full max-w-[70%] mx-auto">
        <div className="w-[62rem] pb-9 pt-12 border-b-[2px] border-[#262626]">
            <div className="flex gap-20 ml-16 items-center relative">
                {searchUserNotes.length > 0 &&
                    <div className="absolute -top-1 left-[7%] z-[1] cursor-pointer">
                        <NoteTooltip isProfile={true} note={searchUserNotes[0]} />
                    </div>
                }
                <Link to={searchUserStatus.length > 0 ? `/search/stories/${selectedProfile.userName}/${searchUserStatus[0]._id}/` : ""} className={`p-2 ${searchUserStatus.length > 0 ? "relative rounded-full multicolor-border" : ""}`} onClick={() => setCurrentStory(0)}>
                    <img src={selectedProfile.profilePic} alt="User Profile" className="rounded-full w-40" />
                </Link>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-6 items-center">
                        <Link className="text-[20px] flex items-center gap-1">{selectedProfile.userName}
                            {selectedProfile.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                        </Link>
                        {isFollowed ? <button className="bg-[#363636] px-7 py-1 rounded-lg" onClick={() => unfollowUser()}>Unfollow</button> : <button className="bg-[#0095F6] px-7 py-1 rounded-lg" onClick={() => followUser()}>Follow</button>}
                    </div>
                    <div className="flex gap-10 items-center">
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.postCount)}</span>posts</p>
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.followersCount)}</span>followers</p>
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(selectedProfile.followingCount)}</span>following</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[14px]">{selectedProfile.fullName}</p>
                        <p className="font-semibold text-[14px]">{selectedProfile.bio}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-10 ml-5 mt-16 h-[7.3rem] overflow-x-auto scrollbar-hidden">
                {searchUserHighLights.length > 0 && searchUserHighLights.map((item, i, arr) => <Link to={`/search/stories/highlight/${arr[i]._id}/`} key={i} onClick={() => {
                    setHighLightStories(searchUserHighLights[i].stories)
                    setCurrentStory(0)
                    setCurrentHighLight(i)
                }}><HighLights title={item.name} image={item.profilePic} /></Link>)}
            </div>
        </div>
        <div className="absolute left-[59%] -translate-x-1/2 flex gap-10">
            <NavLink end to={`/search/${selectedProfile.userName}/`} className={({ isActive }) => `flex items-center tracking-wider py-3 gap-1 text-[12px] ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}><PostsIcon /> POSTS</NavLink >
            <NavLink to={`/search/${selectedProfile.userName}/tagged/`} className={({ isActive }) => `flex items-center tracking-wider py-3 text-[12px] gap-1  ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}><TaggedUser /> TAGGED</NavLink>
        </div>
        <div className="mt-[3.5rem]">
            {!postsLoading ? <Outlet /> : <Loader height="h-[34vh]" />}
        </div>
    </section>
}