import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5"
import { CommentSVG, MoreCommentsSVG, MoreSVG, NotificationIcon, SaveSVG, ShareIcon } from "../assets/Constants";
import { PostSettings } from "./PostSettings";
import { usePost, useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";

export function Post({ isPostOpen, setIsPostOpen, postData, currentIndex, setCurrentIndex, setCurrentPost, comments, setComments, page, setPage, totalPages, setTotalPages }) {
    const { selectedPost, setSelectedPost } = usePost()
    const [commentValue, setCommentValue] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPostSettingOpen, setIsPostSettingOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const { userData } = useUser();
    const commentRef = useRef(null);
    const [commentsLoading, setCommentsLoading] = useState(false);

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
        async function fetchComments() {
            try {
                setCommentsLoading(true);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/comments/${selectedPost._id}?page=${page}&limit=10`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`,
                    },
                    redirect: "follow"
                })
                const result = await response.json()
                setTotalPages(result.data.totalPages)
                setComments((prev) => [
                    ...prev,
                    ...result.data.comments
                ])
            } catch (error) {
                console.error(error);
            } finally {
                setCommentsLoading(false);
            }
        }
        if (selectedPost !== null) {
            fetchComments();
        }
    }, [selectedPost, page])
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
    function formatDate(dateString) {
        const now = new Date();
        const targetDate = new Date(dateString);
        const diffInMilliseconds = Math.abs(targetDate - now);
        const MINUTE = 60 * 1000;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;
        const WEEK = 7 * DAY;

        if (diffInMilliseconds >= WEEK) {
            const weeks = Math.floor(diffInMilliseconds / WEEK);
            return `${weeks} week${weeks > 1 ? "s" : ""}`;
        } else if (diffInMilliseconds >= DAY) {
            const days = Math.floor(diffInMilliseconds / DAY);
            const hours = Math.floor((diffInMilliseconds % DAY) / HOUR);
            return hours > 0
                ? `${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""}`
                : `${days} day${days > 1 ? "s" : ""}`;
        } else if (diffInMilliseconds >= HOUR) {
            const hours = Math.floor(diffInMilliseconds / HOUR);
            const minutes = Math.floor((diffInMilliseconds % HOUR) / MINUTE);
            return minutes > 0
                ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`
                : `${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
            const minutes = Math.floor(diffInMilliseconds / MINUTE);
            return `${minutes} minute${minutes > 1 ? "s" : ""}`;
        }
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
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(commentValue.length === 0);
        }
    }
    return <>
        <IoCloseSharp
            className={`fixed text-[35px] top-8 right-9 z-[100000] cursor-pointer opacity-0 ${isPostOpen ? "opacity-100" : "pointer-events-none"}`}
            onClick={() => handleClose()}
        />
        <div
            className={`overlay z-[100] opacity-0 transition-all duration-500 ${!isPostOpen ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={() => handleClose()}
        ></div>
        <div
            className={`fixed opacity-0 top-[51%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isPostOpen ? "opacity-100" : "pointer-events-none"
                }`}
        >
            <div className="w-[80rem] h-[55rem] flex">
                <div className="w-[60%] h-full relative overflow-hidden">
                    <div className={`w-full flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
                        {selectedPost !== null ? selectedPost.imageUrls.map((item, i) => {
                            return <img src={item} key={i} alt="Posts" className="object-cover h-full" />
                        }) : ""}
                    </div>
                    {selectedPost !== null && selectedPost.imageUrls.length > 1 ? <> {selectedPost !== null && currentIndex !== selectedPost.imageUrls.length - 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleIncrease}><FaArrowRight className="fill-black" /></button>}
                        {currentIndex !== 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleDecrease}><FaArrowLeft className="fill-black" /></button>}
                    </> : ""}
                </div>
                <div className="w-[40%] h-full bg-[#000000] relative">
                    <div className="flex justify-between items-center p-5 border-b-[1px] border-[#262626]">
                        <div className="flex flex-row gap-4 items-center ">
                            <img src={postData.data.user.profilePic} alt="Profile Picture" className="w-12 rounded-full" />
                            <p className="text-[15px] font-semibold">{postData.data.user.userName}</p>
                        </div>
                        <button onClick={() => {
                            setIsPostSettingOpen(true)
                        }}>
                            <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
                        </button>
                    </div>
                    <div className="w-full flex flex-col h-[71.7%] gap-4 overflow-auto scrollbar-hidden">
                        {selectedPost !== null && selectedPost.caption &&
                            <div>
                                <div className="w-full px-6 mt-4 text-[15px]">
                                    <div className="flex flex-row gap-4 items-start">
                                        <img src={postData.data.user.profilePic} alt="Profile Picture" className="w-9 rounded-full" />
                                        <p><Link className="text-[14px] font-semibold hover:opacity-50 mr-3">{postData.data.user.userName}</Link>{selectedPost !== null && selectedPost.caption}</p>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="flex flex-col gap-4 ml-2">
                            {commentsLoading ? <div className="">{Array.from({ length: 20 }, (_, i) => <Skeleton key={i} />)}</div> : (
                                comments?.map((item, i) => {
                                    return (
                                        <div key={i} className="flex gap-4 ml-4">
                                            <img
                                                src={item.user.profilePic}
                                                alt={item.user.userName}
                                                className="w-9 h-9 rounded-full"
                                            />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[15px]">
                                                    <Link className="text-[13px] mr-2 font-semibold hover:opacity-50 transition duration-150">
                                                        {item.user.userName}
                                                    </Link>
                                                    {item.comment}
                                                </p>
                                                <p className="text-[12px] text-[#A8A8A8]">
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div className="w-full flex justify-center items-center mb-2">
                                {page !== totalPages && !commentsLoading && comments !== null && comments?.length !== 0 ? <button className="hover:opacity-55 transition-all duration-150" onClick={() => setPage((prev) => prev + 1)}><MoreCommentsSVG /></button> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 z-[100] border-t-[1px] h-[10rem] border-[#262626] w-full">
                        <div className="flex justify-between pt-5 px-5 ">
                            <div className="flex flex-row gap-5">
                                <NotificationIcon className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
                                <button onClick={() => commentRef.current.focus()}>
                                    <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
                                </button>
                                <ShareIcon className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
                            </div>
                            <button>
                                <SaveSVG className="hover:stroke-gray-30000 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
                            </button>
                        </div>
                        <div>
                            {selectedPost !== null && <div className="mt-2 px-5">
                                <button className="text-[15px] font-semibold">{selectedPost.likes.length} likes</button>
                                <p className="text-[12px] text-[#A8A8A8]">{formatDate(selectedPost.createdAt)} ago</p>
                            </div>}
                        </div>
                        <div className="mt-5 border-t-[1px] flex items-center border-[#262626] px-5 py-2">
                            <input ref={commentRef} type="text" value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder="Add a comment...." className="w-[90%] bg-transparent outline-none placeholder:text-[14px]" />
                            <button className={`text-[#0095F6] ml-5 text-[12px] transition-all duration-150 ${isDisabled ? "opacity-50 " : "cursor-pointer hover:opacity-70"}`} disabled={isDisabled} onClick={() => postComment()}>POST</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PostSettings isPostSettingOpen={isPostSettingOpen} setIsPostSettingOpen={setIsPostSettingOpen} setIsPostOpen={setIsPostOpen} />
    </>
}