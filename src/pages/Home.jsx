import { Link } from "react-router-dom";
import { Like, SaveSVG, UnLike, UnSave } from "../assets/Constants";
import { useEffect, useState } from "react";
import { usePost, useSearch, useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/Loader";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import { Post } from "../components/Post";
import { fetchUserDataOnClick } from "../utils/helper";
import { CommentHome } from "../components/CommentHome";
import { fetchHomePosts, formatDate } from "../utils/helper";

export function Home() {
    const { userData, setUserData, setMainLoading } = useUser()
    const { setSelectedPost } = usePost()
    const { setSelectedProfile } = useSearch();
    const [count, setCount] = useState(0);
    const [homePosts, setHomePosts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(Array(homePosts.length).fill(0));
    const [totalIndex, setTotalIndex] = useState(Array(homePosts.length).fill(0))
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPostsLoading, setIsPostsLoading] = useState(false)
    const [savedPosts, setSavedPosts] = useState(Array(homePosts.length).fill(false));
    const [likedPosts, setLikedPosts] = useState(Array(homePosts.length).fill(false));
    const [isPostOpen, setIsPostOpen] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (homePosts !== null) {
            const updatedLikedPosts = homePosts.map((post) => post.likes.includes(userData?.data.user._id))
            setLikedPosts(updatedLikedPosts)
        }
        if (homePosts !== null) {
            const updatedSavedPosts = homePosts.map((post) =>
                userData.data.user.savedPosts.includes(post._id)
            );
            setSavedPosts(updatedSavedPosts);
        }
        if (homePosts !== null) {
            const updatedCurrentIndex = homePosts.map((post) => post?.imageUrls.length)
            setCurrentIndex(Array(updatedCurrentIndex.length).fill(0))
            setTotalIndex(updatedCurrentIndex)
        }

    }, [homePosts, userData])

    useEffect(() => {
        setIsPostsLoading(true)
        setCount((prev) => prev + 1);
        fetchHomePosts(userData, setHomePosts, setIsPostsLoading)
    }, [])

    function handleIncrease(index) {
        setIsAnimating(true);
        setCurrentIndex((prev) => {
            const updated = [...prev];
            updated[index]++;
            return updated;
        })
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    function handleDecrease(index) {
        setIsAnimating(true);
        setCurrentIndex((prev) => {
            const updated = [...prev];
            updated[index]--;
            return updated;
        })
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    async function savePost(id, index) {
        try {
            setSavedPosts((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });

            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/save/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            setUserData((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        savedPosts: result.savedPosts.includes(id)
                            ? [...prev.data.user.savedPosts, id]
                            : [...prev.data.user.savedPosts],
                    },
                },
            }));
        } catch (error) {
            console.error(error)
        }
    }

    async function unSavePost(id, index) {
        try {
            setSavedPosts((prev) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/unsave/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            setUserData((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        savedPosts: prev.data.user.savedPosts.filter(
                            (postId) => postId !== id
                        ),
                    },
                },
            }));
        } catch (error) {
            console.error(error)
        }
    }

    async function likePost(id, index) {
        try {
            setLikedPosts((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });

            setHomePosts((prev) => {
                const updatedPosts = [...prev];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    likeCount: updatedPosts[index].likeCount + 1,
                    likes: updatedPosts[index].likes.includes(userData.data.user._id)
                        ? updatedPosts[index].likes
                        : [...updatedPosts[index].likes, userData.data.user._id],
                };
                return updatedPosts;
            });

            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/like/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                },
            });

            const result = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function unLikePost(id, index) {
        try {
            setLikedPosts((prev) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });

            setHomePosts((prev) => {
                const updatedPosts = [...prev];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    likeCount: updatedPosts[index].likeCount - 1,
                    likes: updatedPosts[index].likes.filter(
                        (userId) => userId !== userData.data.user._id
                    ),
                };
                return updatedPosts;
            });

            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/dislike/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                },
            });

            const result = await response.json();
        } catch (error) {
            console.error(error);
        }
    }


    return <><section className="w-full max-w-[40%] mx-auto">
        <div className={`flex flex-col gap-2 w-full ${isPostsLoading || homePosts.length === 0 ? "h-[90vh]" : ""} ${homePosts.length < 2 ? "h-[90vh]" : ""}`}>
            {!isPostsLoading ?
                <InfiniteScroll dataLength={homePosts.length} loader={homePosts.length > 0 && <Loader height="h-[10vh]" />} next={fetchHomePosts} hasMore={count < 10} >
                    {
                        homePosts.length > 0 ? homePosts.map((item, index) => {
                            return <div key={index} className="flex flex-col gap-2 mt-7 border-b-[2px] border-[#262626] pb-4">
                                <div className="flex flex-row items-center gap-2">
                                    <img src={item?.user.profilePic} className="rounded-full w-10" alt="" />
                                    <div className="flex flex-row gap-1 items-center">
                                        <Link to={`/search/${item?.user.userName}/`} onClick={() => {
                                            fetchUserDataOnClick(item?.user.userName, userData, setSelectedProfile, setMainLoading)
                                            setMainLoading(true)
                                        }} className="font-semibold text-[12px] hover:opacity-70 transition duration-200">{item?.user.userName}</Link>
                                        <p className="text-[#A8A8A8]">•</p>
                                        <p className="text-[#a8a8a8] text-[13px] font-medium">{formatDate(item.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="w-full rounded-md bg-[#000000] border-[1px] border-[#2B2B2D] relative overflow-hidden">
                                    <div className={`w-full h-full flex items-start ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex[index] * 100}%)` }}>
                                        {item !== null ? item.imageUrls.map((item, i) => {
                                            return <img src={item} key={i} alt="Posts" className="w-full object-cover" />
                                        }) : ""}
                                    </div>
                                    {item?.imageUrls.length > 1 ? <> {item !== null && currentIndex[index] !== totalIndex[index] - 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => handleIncrease(index)}><FaArrowRight className="fill-black" /></button>}
                                        {currentIndex[index] !== 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => handleDecrease(index)}><FaArrowLeft className="fill-black" /></button>}
                                    </> : ""}
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-row gap-3">
                                            {!likedPosts[index] ?
                                                <button onClick={() => likePost(item._id, i)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer`} /></button>
                                                : <button onClick={() => unLikePost(item._id, i)}><UnLike className={`hover:opacity-80 fill-red-700 transition-all duration-150 cursor-pointer`} /></button>}
                                            <CommentHome setCurrentIndex={setCurrentIndex} item={item} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} setSelectedPost={setSelectedPost} i={index} />
                                        </div>
                                        {!savedPosts[index] ?
                                            <button onClick={() => savePost(item._id, i)}>
                                                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
                                            </button>
                                            :
                                            <button onClick={() => unSavePost(item._id, i)}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
                                        }
                                    </div>
                                    <p className="text-[14px] font-medium">{item.likeCount} likes</p>
                                    <div className="w-full text-[15px]">
                                        <p className="text-[13px] text-[#a8a8a1]">
                                            <p className="text-[14px] text-white font-semibold mr-2">
                                                {item.user.userName}
                                            </p>
                                            {item.caption !== null && item.caption}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        })
                            : ''}

                </InfiniteScroll>
                : <Loader />}
            {
                homePosts.length === 0 && !isPostsLoading &&
                <div className="absolute top-20 left-[52%] flex flex-col items-center gap-1">
                    <RiUserFollowFill className="text-[40px]" />
                    <h2 className="text-[40px] font-semibold">Follow Someone</h2>
                </div>
            }
        </div>
    </section>
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={homePosts[currentPost]?.user} page={page} setPage={setPage} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} totalPages={totalPages} setTotalPages={setTotalPages} comments={comments} setComments={setComments} />
    </>
}