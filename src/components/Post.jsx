import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MoreCommentsSVG, MoreSVG } from "../assets/Constants";
import { PostSettings } from "./PostSettings";
import { useSearch, useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "./Skeleton";
import { fetchUserDataOnClick, formatDate } from "../utils/helper";
import { usePost } from "../context/PostContext";
import { UserHoverModal } from "./UserHoverModal";
import { PostComment } from "./PostComment";
import { PostOptions } from "./PostOptions";
import { Overlay } from "./Overlay";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";

export function Post({ isPostOpen, setIsPostOpen, postData, currentIndex, setCurrentIndex, setCurrentPost, page, setPage, totalPages, setTotalPages, currentPost, comments, setComments }) {
    const { selectedPost, setSelectedPost, setIsMyPost, setIsSaved, commentValue, setIsDisabled, setCommentValue, setIsPostSettingOpen, setIsCommented, isCommented, isAnimating, setIsAnimating, commentsLoading, setCommentsLoading, isDisabled, isPostSettingOpen, isMyPost } = usePost()
    const { userData, setMainLoading, setMessage } = useUser();
    const { setSelectedProfile } = useSearch()
    const [isHovered, setIsHovered] = useState(false)
    const [isCommentHovered, setIsCommentHovered] = useState(Array(comments?.length).fill(false))
    const commentRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        if (comments?.length > 0) {
            setIsCommentHovered(Array(comments?.length).fill(false))
        }
    }, [comments?.length])

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

    function handleClick(item, postData) {
        setMainLoading(true);
        fetchUserDataOnClick(item !== null ? item?.user.userName : postData?.userName, userData, null, setSelectedProfile, setMainLoading);
        setSelectedPost(null);
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseEnterForComments = (i) => {
        setIsCommentHovered((prev) => {
            const updated = [...prev]
            updated[i] = true;
            return updated;
        });
    };

    const handleMouseLeaveForComments = (i) => {
        setIsCommentHovered((prev) => {
            const updated = [...prev]
            updated[i] = false;
            return updated;
        })
    };

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
            <Overlay handleClose={handleClose} isPostOpen={isPostOpen} />
            <div
                className={`fixed opacity-0 top-1/2 -translate-y-1/2 w-full 1280:max-w-[69rem] max-w-[65rem] -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isPostOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none"
                    }`}
            >

                <div className="h-full flex">
                    <div className="1280:w-[70rem] w-[55rem] relative overflow-hidden">
                        <div className={`w-full flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
                            {selectedPost !== null ? selectedPost.imageUrls.map((item, i) => {
                                return <img src={item} key={i} alt="Posts" className="object-fill h-full w-full" />
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
                    <div className="1280:w-[45rem] w-[60rem] bg-[#000000] relative">
                        <div className="flex relative justify-between items-center p-5 border-b-[1px] border-[#262626]">
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Link
                                        to={userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`}
                                        onClick={() => handleClick(null, postData)}
                                        className="text-[15px] flex flex-row gap-4 items-center font-semibold"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <img src={postData?.profilePic} alt="Profile Picture" className="w-12 rounded-full" />
                                        <p className="hover:opacity-70 transition duration-200">{postData?.userName}</p>
                                    </Link>
                                </HoverCardTrigger>
                                <div className="absolute z-[200]" onClick={() => {
                                    handleClick(null, postData)
                                    navigate(userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`)
                                }}>
                                    <HoverCardContent>
                                        <UserHoverModal username={postData?.userName} isHovered={isHovered} />
                                    </HoverCardContent>
                                </div>
                            </HoverCard>
                            <button onClick={() => setIsPostSettingOpen(true)}>
                                <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
                            </button>
                        </div>
                        <div className="w-full flex flex-col xl:h-[63.5vh] lg:h-[56%] h-[48%] gap-4 overflow-auto scrollbar-hidden">
                            {selectedPost !== null && selectedPost.caption && (
                                <div>
                                    <div className="w-full px-6 mt-4 text-[15px]">
                                        <div className="flex flex-row gap-4 items-start">
                                            <img src={postData?.profilePic} alt="Profile Picture" className="w-9 rounded-full" />
                                            <p>
                                                <p className="text-[14px] font-semibold mr-3 cursor-default">{postData?.userName}</p>
                                                {selectedPost.caption}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-4 ml-5 pt-2">
                                {commentsLoading ? (
                                    <div className="flex flex-col gap-4">{Array.from({ length: 20 }, (_, i) => <Skeleton key={i} />)}</div>
                                ) : (
                                    comments?.map((item, i) => (
                                        <div key={i} className="flex gap-4 ml-1">
                                            <img src={item.user.profilePic} alt={item.user.userName} className="w-9 h-9 rounded-full" />
                                            <HoverCard>
                                                <div className="flex flex-col gap-1 relative">
                                                    <p className="text-[15px]">
                                                        <HoverCardTrigger>
                                                            <Link
                                                                to={userData?.data.user._id !== item?.user._id ? `/search/${item?.user.userName}/` : `/${userData?.data.user.userName}/`}
                                                                onClick={() => handleClick(item)}
                                                                className="text-[13px] mr-2 font-semibold hover:opacity-50 transition duration-150"
                                                                onMouseEnter={() => handleMouseEnterForComments(i)}
                                                                onMouseLeave={() => handleMouseLeaveForComments(i)}
                                                            >
                                                                {item.user.userName}
                                                            </Link>
                                                        </HoverCardTrigger>
                                                        {item.comment}
                                                    </p>
                                                    <div className="absolute z-[200]" onClick={() => {
                                                        handleClick(item)
                                                        navigate(userData?.data.user._id !== item?.user._id
                                                            ? `/search/${item?.user.userName}/`
                                                            : `/${userData?.data.user.userName}/`)
                                                    }}>
                                                        <HoverCardContent>
                                                            <UserHoverModal username={item?.user.userName} isHovered={isCommentHovered[i]} />
                                                        </HoverCardContent>
                                                    </div>
                                                    <p className="text-[12px] text-[#A8A8A8]">{formatDate(item.createdAt)}</p>
                                                </div>
                                            </HoverCard>
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
                        <div className="absolute bottom-0 z-[150] border-t-[1px] h-[10rem] border-[#262626] w-full bg-[#000]">
                            <PostOptions postData={postData} commentRef={commentRef} />
                            <div>
                                {selectedPost !== null && (
                                    <div className="mt-2 px-5">
                                        <button className="text-[15px] font-semibold">{selectedPost.likeCount} likes</button>
                                        <p className="text-[12px] text-[#A8A8A8]">{formatDate(selectedPost.createdAt)} ago</p>
                                    </div>
                                )}
                            </div>
                            <PostComment commentRef={commentRef} commentValue={commentValue} setCommentValue={setCommentValue} isDisabled={isDisabled} postComment={postComment} />
                        </div>
                    </div>
                </div >
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