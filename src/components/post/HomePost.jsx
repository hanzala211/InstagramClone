import { Link, useNavigate } from "react-router-dom"
import { useSearch, useUser } from "../../context/UserContext"
import { CommentHome } from "../comments/CommentHome"
import { usePost } from "../../context/PostContext"
import { Like, SaveSVG, UnLike, UnSave } from "../../assets/Constants"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { fetchComments, fetchUserDataOnClick, formatDate } from "../../utils/helper"
import { useEffect, useRef, useState } from "react"
import { UserHoverModal } from "../usermodals/UserHoverModal"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { CommentDrawer } from "../comments/CommentDrawer"
import { LikeAnimation } from "./LikeAnimation"
import { PostComment } from "../comments/PostComment"


export function HomePost({ index, item, homePosts, setHomePosts, setCurrentPost, setCurrentPostIndex, setIsPostOpen, isPost, arr }) {
    const { userData, setMainLoading, setUserData, setMessage } = useUser()
    const { setSelectedProfile } = useSearch()
    const { setSelectedPost, selectedPost, setComments, setCommentsLoading, setTotalPages, page, isCommented } = usePost()
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(Array(homePosts.length).fill(0))
    const [totalIndex, setTotalIndex] = useState(Array(homePosts.length).fill(0))
    const [savedPosts, setSavedPosts] = useState(Array(homePosts.length).fill(false))
    const [likedPosts, setLikedPosts] = useState(Array(homePosts.length).fill(false))
    const [isHovered, setIsHovered] = useState(Array(homePosts.length).fill(false))
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)
    const [showHeart, setShowHeart] = useState(false);
    const [heartIndex, setHeartIndex] = useState(null);
    const lastTouchTime = useRef(0);
    const commentRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            setTotalIndex(updatedCurrentIndex)
        }
        if (homePosts) {
            setCurrentIndex(Array(homePosts.length).fill(0))
        }
        if (homePosts) {
            setIsHovered(Array(homePosts.length).fill(false))
        }
    }, [homePosts])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetchComments(signal, setComments, setCommentsLoading, setTotalPages, userData, selectedPost, page);
        return () => {
            controller.abort();
        };
    }, [page, selectedPost?._id, userData.data.token, isCommented])

    const handleDoubleClick = (id, indexForClick) => {
        setHeartIndex(indexForClick);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!likedPosts[indexForClick]) {
            likePost(id, indexForClick)
        }
    };

    function handleIncrease(index) {
        setIsAnimating(true);
        setCurrentIndex((prev) => {
            const updated = [...prev];
            updated[index] = updated[index] + 1 < totalIndex[index] ? updated[index] + 1 : updated[index];
            return updated;
        });
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    function handleDecrease(index) {
        setIsAnimating(true);
        setCurrentIndex((prev) => {
            const updated = [...prev];
            updated[index] = updated[index] - 1 >= 0 ? updated[index] - 1 : updated[index];
            return updated;
        });
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    const handleMouseEnter = (index) => {
        setIsHovered((prev) => {
            const updated = [...prev]
            updated[index] = true;
            return updated;
        });
    };

    const handleMouseLeave = (index) => {
        setIsHovered((prev) => {
            const updated = [...prev]
            updated[index] = false;
            return updated;
        })
    };

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
            if (result.status !== "fail") {
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
                setMessage("Post Saved Successfully")
            }
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
            if (result.status !== "fail") {
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
                setMessage("Post Unsaved Successfully")
            }
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
            if (result.message !== "Post liked successfully.") {
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
                        likes: updatedPosts[index].likes.includes(userData.data.user._id)
                            ? updatedPosts[index].likes
                            : [...updatedPosts[index].likes, userData.data.user._id],
                    };
                    return updatedPosts;
                });
            } else {
                setMessage(result.message)
            }
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
            if (result.message !== "Post disliked successfully.") {
                setLikedPosts((prev) => {
                    const updated = [...prev];
                    updated[index] = false;
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
            } else {
                setMessage(result.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <div className={`flex flex-col gap-2 mt-7 ${isPost ? "" : "border-b-[2px] border-[#262626]"} pb-4`}>
        <div className={`flex flex-row items-center gap-2`}>
            <img src={item?.user?.profilePic || item?.postBy?.profilePic || userData?.data?.user?.profilePic} className="rounded-full w-10" alt="" />
            <div className="flex flex-row gap-1 items-center relative">
                <HoverCard>
                    <HoverCardTrigger>
                        <Link to={`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`} onClick={() => {
                            fetchUserDataOnClick(item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName, userData, null, setSelectedProfile, setMainLoading)
                            setMainLoading(true)
                        }} className="font-semibold text-[12px] hover:opacity-70 transition duration-200" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>{item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}</Link>
                    </HoverCardTrigger>
                    <div onClick={() => {
                        fetchUserDataOnClick(item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName, userData, null, setSelectedProfile, setMainLoading)
                        setMainLoading(true)
                        navigate(`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`)
                    }} className="absolute z-[50]">
                        <HoverCardContent>
                            <UserHoverModal username={item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName} isHovered={isHovered[index]} />
                        </HoverCardContent>
                    </div>
                    <p className="text-[#A8A8A8]">•</p>
                    <p className="text-[#a8a8a8] text-[13px] font-medium">{formatDate(item.createdAt)}</p>
                </HoverCard>
            </div>
        </div>
        <div className={`w-full bg-[#000000] border-[1px] border-[#2B2B2D] relative overflow-hidden ${isPost ? "" : "rounded-md"}`}>
            <div className={`w-full ${isPost ? "h-[29rem]" : "h-full"} flex items-start ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex[index] * 100}%)` }}>
                {item !== null ? item.imageUrls.map((item, i) => {
                    return <div className="relative flex-shrink-0 w-full h-full"
                        key={i}>
                        <img onDoubleClick={() => handleDoubleClick(arr[index]._id, i)}
                            onTouchStart={() => {
                                const currentTime = Date.now();
                                const timeDifference = currentTime - lastTouchTime.current;
                                if (timeDifference < 300 && timeDifference > 0) {
                                    handleDoubleClick(arr[index]._id, i)
                                }
                                lastTouchTime.current = currentTime;
                            }} src={item} alt="Posts" className="w-full h-full object-cover" />
                        <LikeAnimation showHeart={showHeart} heartIndex={heartIndex} index={index} />

                    </div>
                }) : ""}
            </div>
            {item?.imageUrls.length > 1 ? <> {item !== null && currentIndex[index] !== totalIndex[index] - 1 && <button className="absolute md:right-4 right-1 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => handleIncrease(index)}><FaArrowRight className="fill-black" /></button>}
                {currentIndex[index] !== 0 && <button className="absolute md:left-4 left-1 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={() => handleDecrease(index)}><FaArrowLeft className="fill-black" /></button>}
            </> : ""}
        </div>
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-3">
                    {!likedPosts[index] ?
                        <button onClick={() => likePost(item._id, index)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer mb-1`} /></button>
                        : <button onClick={() => unLikePost(item._id, index)}><UnLike className={`hover:opacity-80 fill-red-700 mb-1 transition-all duration-150 cursor-pointer`} /></button>}
                    {innerWidth >= 768 && <span onClick={() => setSelectedPost(item)}><CommentHome setCurrentIndex={setCurrentPostIndex} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} i={index} /></span>}
                    {innerWidth < 768 &&
                        <Drawer onClose={() => {
                            setComments([])
                        }}>
                            <DrawerContent className="bg-[#000] border-t-[1px] border-[#a8a8a8]">
                                <CommentDrawer />
                            </DrawerContent>
                            <DrawerTrigger><span onClick={() => setSelectedPost(item)}><CommentHome setCurrentIndex={setCurrentPostIndex} item={item} setCurrentPost={setCurrentPost} arr={arr} i={index} /></span></DrawerTrigger>
                        </Drawer>}
                </div>
                {!savedPosts[index] ?
                    <button onClick={() => savePost(item._id, index)}>
                        <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
                    </button> : <button onClick={() => unSavePost(item._id, index)}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
                }
            </div>
            <p className="text-[14px] font-medium">{item.likeCount} likes</p>
            <div className="w-full text-[15px]">
                <p className="text-[13px] text-[#a8a8a1]">
                    <Link to={`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`} onClick={() => {
                        fetchUserDataOnClick(item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName, userData, null, setSelectedProfile, setMainLoading)
                        setMainLoading(true)
                        navigate(`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`)
                    }} className="font-semibold text-[12px] text-white hover:opacity-70 transition duration-200 mr-2">{item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}</Link>
                    {item.caption !== null && item.caption}
                </p>
                <button className="text-[#a8a8a8] text-[14px]">View all {item.commentsCount} comments</button>
                {!isPost &&
                    <div className="md:hidden">
                        <PostComment commentRef={commentRef} item={item} />
                    </div>}
            </div>
        </div>
    </div>
}