import { useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5"
import { CommentSVG, MoreCommentsSVG, MoreSVG } from "../assets/Constants";
import { PostSettings } from "./PostSettings";
import { useSearch, useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";
import { LikedComponent } from "./LikeComponent";
import { SavedComponent } from "./SavedComponent";
import { fetchUserDataOnClick, formatDate } from "../utils/helper";
import { usePost } from "../context/PostContext";

export function Post({ isPostOpen, setIsPostOpen, postData, currentIndex, setCurrentIndex, setCurrentPost, page, setPage, totalPages, setTotalPages, currentPost, comments, setComments }) {
    const { selectedPost, setSelectedPost, setIsMyPost, setIsSaved, commentValue, setIsDisabled, setCommentValue, setIsPostSettingOpen, setIsCommented, isCommented, isAnimating, setIsAnimating, commentsLoading, setCommentsLoading, isSaved, isDisabled, isPostSettingOpen, isMyPost } = usePost()
    const { userData, setUserData, setMainLoading, setMessage } = useUser();
    const { setSelectedProfile } = useSearch()

    const commentRef = useRef(null);

    useEffect(() => {
        if (selectedPost?.postBy?._id !== undefined) {
            setIsMyPost(selectedPost?.postBy._id === userData.data.user._id)
        } else {
            setIsMyPost(selectedPost?.postBy === userData.data.user._id)
        }
        if (selectedPost?._id) {
            setIsSaved(userData.data.user.savedPosts.includes(selectedPost?._id))
        }
    }, [selectedPost?._id])

    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isPostOpen ? "hidden" : "auto";
        return () => body.style.overflowY = "auto"
    }, [isPostOpen])

    useEffect(() => {
        if (commentValue.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true);
        }
    }, [commentValue])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (selectedPost !== null) {
            fetchComments(signal);
        }
        return () => {
            controller.abort();
        };
    }, [page, selectedPost?._id, currentPost, userData.data.token, isCommented])



    function handleClose() {
        setIsPostOpen(false)
        setTimeout(() => {
            setCurrentPost(null)
            setCurrentIndex(0);
            setSelectedPost(null);
            setCommentValue("")
            setComments([]);
            setTotalPages(null);
            setPage(1)
        }, 200)
        setIsPostSettingOpen(false)
    }

    function handleIncrease() {
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1)
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    function handleDecrease() {
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1)
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    async function postComment() {
        try {
            setIsDisabled(true);
            const respone = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/comment/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "comment": commentValue
                }),
                redirect: "follow"
            })
            const result = await respone.json();
            if (result.status !== "fail") {
                setMessage("Commented Successfully")
                setCommentValue("")
                setIsCommented((prev) => !prev)
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
        } finally {
            setIsDisabled(commentValue.length === 0);
        }
    }

    async function savePost() {
        try {
            setIsSaved((prev) => !prev)
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/save/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            if (result.status !== "fail") {
                setUserData((prev) => ({
                    ...prev, data: {
                        ...prev.data, user: {
                            ...prev.data.user, savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0]) ? [...prev.data.user.savedPosts] : [...prev.data.user.savedPosts, ...result.savedPosts]
                        }
                    }
                }))
                setMessage("Post Saved Successfully")
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
            setIsSaved((prev) => !prev)
        }
    }

    async function unSavePost() {
        try {
            setIsSaved((prev) => !prev)
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/unsave/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            if (result.status !== "fail") {
                setUserData((prev) => ({
                    ...prev, data: {
                        ...prev.data, user: {
                            ...prev.data.user, savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0]) ? prev.data.user.savedPosts.filter((item) => item !== result.savedPosts[0]) : [...prev.data.user.savedPosts, ...result.savedPosts]
                        }
                    }
                }))
                setMessage("Post Unsaved Successfully")
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
            setIsSaved((prev) => !prev)
        }
    }

    async function fetchComments(signal) {
        try {
            setCommentsLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/comments/${selectedPost._id}?page=${page}&limit=10`, {
                method: "GET",
                headers: {
                    "Authorization": `${userData.data.token}`,
                },
                redirect: "follow",
                signal
            })
            const result = await response.json()
            setTotalPages(result.data.totalPages);
            setComments((prev) => {
                const newComments = result.data.comments.filter((newComment) => {
                    return !prev.some((existingComment) => existingComment._id === newComment._id);
                });
                return [...newComments, ...prev];
            });
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Fetch failed:", error);
            }
        } finally {
            if (!signal.aborted) {
                setCommentsLoading(false);
            }
        }
    }

    return (
        <>
            <IoCloseSharp
                className={`fixed xl:text-[35px] text-[25px] xl:top-8 lg:top-5 top-2 xl:right-9 lg:right-5 right-2 z-[100000] cursor-pointer opacity-0 ${isPostOpen ? "opacity-100" : "pointer-events-none"}`}
                onClick={handleClose}
            />
            <div
                className={`overlay z-[100] opacity-0 transition-all duration-500 ${!isPostOpen ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                    }`}
                onClick={handleClose}
            ></div>
            <div
                className={`fixed opacity-0 top-1/2 -translate-y-1/2 w-full xl:max-w-[75rem] lg:max-w-[58rem] max-w-[50rem] box-border xl:h-[48rem] lg:h-[35rem] h-[30rem] -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isPostOpen ? "opacity-100" : "pointer-events-none"
                    }`}
            >
                <div className="h-full flex">
                    <div className="w-[60%] h-full relative overflow-hidden">
                        <div className={`w-full flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
                            {selectedPost !== null ? selectedPost.imageUrls.map((item, i) => {
                                return <img src={item} key={i} alt="Posts" className="object-cover h-full w-full" />
                            }) : ""}
                        </div>
                        {selectedPost !== null && selectedPost.imageUrls.length > 1 ? (
                            <>
                                {currentIndex !== selectedPost.imageUrls.length - 1 && (
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleIncrease}>
                                        <FaArrowRight className="fill-black" />
                                    </button>
                                )}
                                {currentIndex !== 0 && (
                                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleDecrease}>
                                        <FaArrowLeft className="fill-black" />
                                    </button>
                                )}
                            </>
                        ) : ""}
                    </div>
                    <div className="w-[40%] h-full bg-[#000000] relative">
                        <div className="flex justify-between items-center p-5 border-b-[1px] border-[#262626]">
                            <Link
                                to={userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`}
                                onClick={() => {
                                    fetchUserDataOnClick(postData?.userName, userData, null, setSelectedProfile, setMainLoading);
                                    setMainLoading(true);
                                    setSelectedPost(null);
                                }}
                                className="text-[15px] flex flex-row gap-4 items-center font-semibold"
                            >
                                <img src={postData?.profilePic} alt="Profile Picture" className="w-12 rounded-full" />
                                <p className="hover:opacity-70 transition duration-200">{postData?.userName}</p>
                            </Link>
                            <button onClick={() => setIsPostSettingOpen(true)}>
                                <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
                            </button>
                        </div>
                        <div className="w-full flex flex-col xl:h-[67.5%] lg:h-[55%] h-[48%] gap-4 overflow-auto scrollbar-hidden">
                            {selectedPost !== null && selectedPost.caption && (
                                <div>
                                    <div className="w-full px-6 mt-4 text-[15px]">
                                        <div className="flex flex-row gap-4 items-start">
                                            <img src={postData?.profilePic} alt="Profile Picture" className="w-9 rounded-full" />
                                            <p>
                                                <Link className="text-[14px] font-semibold mr-3 cursor-default">{postData?.userName}</Link>
                                                {selectedPost.caption}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-4 ml-5 pt-2">
                                {commentsLoading ? (
                                    <div className="flex flex-col gap-4">
                                        {Array.from({ length: 20 }, (_, i) => <Skeleton key={i} np />)}
                                    </div>
                                ) : (
                                    comments?.map((item, i) => (
                                        <div key={i} className="flex gap-4 ml-1">
                                            <img
                                                src={item.user.profilePic}
                                                alt={item.user.userName}
                                                className="w-9 h-9 rounded-full"
                                            />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[15px]">
                                                    <Link
                                                        to={
                                                            userData?.data.user._id !== item?.user._id
                                                                ? `/search/${item?.user.userName}/`
                                                                : `/${userData?.data.user.userName}/`
                                                        }
                                                        onClick={() => {
                                                            setMainLoading(true);
                                                            fetchUserDataOnClick(item?.user.userName, userData, null, setSelectedProfile, setMainLoading);
                                                            setSelectedPost(null);
                                                        }}
                                                        className="text-[13px] mr-2 font-semibold hover:opacity-50 transition duration-150"
                                                    >
                                                        {item.user.userName}
                                                    </Link>
                                                    {item.comment}
                                                </p>
                                                <p className="text-[12px] text-[#A8A8A8]">{formatDate(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div className="w-full flex justify-center items-center mb-2">
                                    {page !== totalPages && !commentsLoading && comments !== null && comments?.length !== 0 ? (
                                        <button className="hover:opacity-55 transition-all duration-150" onClick={() => setPage((prev) => prev + 1)}>
                                            <MoreCommentsSVG />
                                        </button>
                                    ) : ""}
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 z-[100] border-t-[1px] h-[10rem] border-[#262626] w-full">
                            <div className="flex justify-between pt-5 px-5 ">
                                <div className="flex flex-row gap-5">
                                    <LikedComponent postData={postData} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
                                    <button onClick={() => commentRef.current.focus()}>
                                        <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
                                    </button>
                                </div>
                                <SavedComponent isSaved={isSaved} savePost={savePost} unSavePost={unSavePost} />
                            </div>
                            <div>
                                {selectedPost !== null && (
                                    <div className="mt-2 px-5">
                                        <button className="text-[15px] font-semibold">{selectedPost.likeCount} likes</button>
                                        <p className="text-[12px] text-[#A8A8A8]">{formatDate(selectedPost.createdAt)} ago</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-5 border-t-[1px] flex items-center border-[#262626] px-5 py-2">
                                <input
                                    ref={commentRef}
                                    type="text"
                                    value={commentValue}
                                    onChange={(e) => setCommentValue(e.target.value)}
                                    placeholder="Add a comment...."
                                    className="w-[90%] bg-transparent outline-none placeholder:text-[14px]"
                                />
                                <button
                                    className={`text-[#0095F6] ml-5 text-[12px] transition-all duration-150 ${isDisabled ? "opacity-50 " : "cursor-pointer hover:opacity-70"}`}
                                    disabled={isDisabled}
                                    onClick={() => postComment()}
                                >
                                    POST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <PostSettings
                isPostSettingOpen={isPostSettingOpen}
                isMyPost={isMyPost}
                setIsPostSettingOpen={setIsPostSettingOpen}
                setIsPostOpen={setIsPostOpen}
            />
        </>
    );

}