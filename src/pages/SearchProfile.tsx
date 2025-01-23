import { MdVerified } from "react-icons/md";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Loader } from "../components/helpers/Loader";
import { MobilePostIcon, PostsIcon } from "../assets/Constants";
import { HighLights } from "../components/story/Highlights"
import { LoadingPage } from "./LoadingPage";
import { UserFollowDetails } from "../components/usermodals/UserFollowDetails";
import { NoteDiv } from "../components/note/NoteDiv";
import { follow, getDataOnClick, unfollow } from "../services/searchProfile";
import { useChat } from "../context/ChatContext";
import { useSearch } from "../context/SearchContext";
import { FollowButton } from "../components/profile/FollowButtons";
import { ProfileNavLink } from "../components/profile/ProfileNavLink";
import { Post } from "../types/postType";
import { Note } from "../types/note";
import { useAuth } from "../context/AuthContext";

interface PostObj {
    message: string;
    post: Post;
}

export function SearchProfile() {
    const { setSearchUserPosts, searchUserStatus, setSearchUserStatus, searchUserHighLights, setSearchUserHighLights, postsLoading, setPostsLoading, fetchPosts } = useSearch();
    const { setSelectedChat } = useChat()
    const { setHighLightStories, setCurrentHighLight, setCurrentStory, setMessage } = useUser()
    const { userData, setUserData, mainLoading, setMainLoading, token, setSelectedProfile, selectedProfile } = useAuth()
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const [searchUserNotes, setSearchUserNotes] = useState<Note[] | string[]>([])
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const navigate = useNavigate();
    const params = useParams();


    useEffect(() => {
        if (params.username === userData?.data.user.userName) {
            navigate(`/${userData.data.user.userName}/`)
        }
    }, [params.username, userData?.data.user.userName, navigate])

    useEffect(() => {
        if (userData?.data?.user?.following && selectedProfile?._id) {
            setIsFollowed(userData.data.user.following.includes(selectedProfile._id));
        }
        setSearchUserHighLights(selectedProfile?.highlights ?? []);
        setSearchUserNotes(selectedProfile?.notes ?? []);
        setSearchUserStatus(selectedProfile?.stories ?? []);
    }, [selectedProfile?._id, userData?.data?.user?.following]);

    useEffect(() => {
        if (selectedProfile?.posts && selectedProfile.posts.length > 0) {
            Promise.all(
                selectedProfile.posts.map((item: string) =>
                    fetchPosts(item)
                )
            )
                .then((res: PostObj[]) => {
                    setSearchUserPosts(res.map((item) => item?.post));
                })
                .finally(() => setPostsLoading(false));
        } else {
            setSearchUserPosts([]);
            setPostsLoading(false);
        }
    }, [selectedProfile?.posts, userData?.data.token]);

    const followUser = async () => {
        try {
            setUserData((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        following: [...prev.data.user.following, selectedProfile?._id],
                        followingCount: prev.data.user.followingCount + 1,
                    },
                },
            }));
            setIsDisabled(true);
            setSelectedProfile((prev: any) => ({
                ...prev,
                followersCount: prev.followersCount + 1,
            }));
            setIsDisabled(true);
            const res = await follow({
                selectedProfile,
                token
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false);
            setMessage('User Followed Successfully');
        }
    }

    const unFollowUser = async () => {
        try {
            setUserData((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        following: [
                            prev.data.user.following.filter(
                                (item: string) => item !== selectedProfile?._id
                            ),
                        ],
                        followingCount: prev.data.user.followingCount - 1,
                    },
                },
            }));
            setIsDisabled(true);
            setSelectedProfile((prev: any) => ({
                ...prev,
                followersCount: prev.followersCount - 1,
            }));
            const res = await unfollow({
                selectedProfile,
                token
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false);
            setMessage('User UnFollowed Successfully');
        }
    }

    return <>
        {!mainLoading ?
            <section className="w-full lg:max-w-[57%] md:max-w-[87%] max-w-[100%] mx-auto">
                <div className="w-full max-w-[61rem] sm:pl-5 pl-1 md:pl-0 pb-9 lg:pt-20 pt-8 md:border-b-[2px] md:border-[#262626]">
                    <div className="flex w-full xl:gap-20 lg:gap-5 gap-2 sm:items-center relative">
                        {searchUserNotes.length > 0 &&
                            <NoteDiv notes={searchUserNotes[0]} />
                        }
                        <Link to={searchUserStatus.length > 0 ? `/search/stories/${selectedProfile?.userName}/${searchUserStatus[0]._id}/` : ""}
                            className={`p-2 ${searchUserStatus.length > 0 ? "relative rounded-full multicolor-border" : ""} h-[5.9rem] sm:h-32 md:h-auto flex justify-center items-center`}
                            onClick={() => setCurrentStory(0)}>
                            <img src={selectedProfile?.profilePic} alt="User Profile" className="rounded-full w-[5rem] h-full sm:w-28 lg:w-40 lg:min-w-[10rem] min-w-[5rem] sm:h-28 lg:h-40 object-cover" />
                        </Link>
                        <div className="flex flex-col gap-2 sm:gap-5 mt-2 xl:mt-0">
                            <div className="flex md:flex-row flex-col gap-3 sm:gap-6 md:items-center">
                                <button className="text-[20px] flex items-center gap-1">
                                    {selectedProfile?.userName}
                                    {selectedProfile?.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                                </button>
                                <div className="flex gap-3">
                                    <FollowButton
                                        isFollowed={isFollowed}
                                        isDisabled={isDisabled}
                                        onClick={isFollowed ? () => unFollowUser() : () => followUser()}
                                    />
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
                                <p className="font-semibold text-[14px]">{selectedProfile?.fullName}</p>
                                <p className="font-semibold text-[14px] text-[#a8a8a8] w-[250px] break-words">{selectedProfile?.bio}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`flex gap-10 ml-5 md:mt-16 mt-7 ${searchUserHighLights?.length === 0 ? "h-2 md:h-24" : "md:h-36 h-24"} overflow-x-auto scrollbar-hidden`}>
                        {searchUserHighLights?.length > 0 && searchUserHighLights?.map((item, i, arr) =>
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
                <ProfileNavLink
                    icon={innerWidth > 770 ? PostsIcon : MobilePostIcon}
                    label={innerWidth > 770 ? "POSTS" : ""}
                    to={`/search/${selectedProfile?.userName}/`}
                />
                <div className="md:mt-[4rem] mt-6">
                    {!postsLoading ? <Outlet /> : <Loader height="h-[34vh]" />}
                </div>
            </section>
            : <LoadingPage />}
    </>
}