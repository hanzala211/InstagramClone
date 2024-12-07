import { useEffect, useRef, useState } from "react";
import { MoreCommentsSVG, MoreSVG } from "../../assets/Constants";
import { PostSettings } from "./PostSettings";
import { useSearch, useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { fetchComments, fetchUserDataOnClick, formatDate } from "../../utils/helper";
import { usePost } from "../../context/PostContext";
import { UserHoverModal } from "../usermodals/UserHoverModal";
import { PostComment } from "../comments/PostComment";
import { PostOptions } from "./PostOptions";
import { Overlay } from "../helpers/Overlay";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { PostSlider } from "./PostSlider";
import { CommentsStructure } from "../comments/CommentsStructure";

export function Post({ isPostOpen, setIsPostOpen, postData, currentIndex, setCurrentIndex, setCurrentPost, page, setPage, totalPages, setTotalPages, currentPost, comments, setComments }) {
    const { selectedPost, setSelectedPost, setIsMyPost, setIsSaved, setCommentValue, setIsPostSettingOpen, isCommented, commentsLoading, setCommentsLoading, isPostSettingOpen, isMyPost } = usePost()
    const { userData, setMainLoading } = useUser();
    const { setSelectedProfile } = useSearch()
    const [isHovered, setIsHovered] = useState(false)
    const commentRef = useRef(null);
    const navigate = useNavigate()

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
        const controller = new AbortController();
        const signal = controller.signal;

        if (selectedPost !== null) {
            fetchComments(signal, setComments, setCommentsLoading, setTotalPages, userData, selectedPost, page);
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

    function handleClick(item, postData) {
        setMainLoading(true);
        fetchUserDataOnClick(item !== null ? item?.user.userName : postData?.userName, userData, null, setSelectedProfile, setMainLoading);
        setSelectedPost(null);
    }

    return (
        <>
            <Overlay handleClose={handleClose} isPostOpen={isPostOpen} />
            <div className={`fixed opacity-0 top-[40%] sm:top-1/2 -translate-y-1/2 w-full 1280:max-w-[90rem] lg:max-w-[65rem] md:h-[32rem] 1280:h-auto md:max-w-[52rem] h-[25rem] max-w-[20rem] -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isPostOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none"}`}>
                <div className="h-full flex flexBox">
                    <div className="absolute md:hidden block -top-6 -left-3">
                        <Link
                            to={userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`}
                            onClick={() => handleClick(null, postData)}
                            className="text-[13px] flex flex-row gap-4 items-center font-semibold"
                        >
                            <img src={postData?.profilePic} alt="Profile Picture" className="w-10 rounded-full" />
                            <p className="hover:opacity-70 transition duration-200">{postData?.userName}</p>
                        </Link>
                    </div>
                    <PostSlider currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                    <div className="1280:w-[45rem] lg:w-[60rem] md:w-[65rem] w-[22rem] bg-[#000000] absolute -bottom-32 md:relative md:bottom-0">
                        <div className="flex relative justify-between items-center p-5 border-b-[1px] border-[#262626]">
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Link
                                        to={userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`}
                                        onClick={() => handleClick(null, postData)}
                                        className="text-[15px] flex flex-row gap-4 items-center font-semibold"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
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
                        <div className="w-full md:flex hidden flex-col 1280:h-[60.5vh] lg:h-[56%] h-[48%] gap-4 overflow-auto scrollbar-hidden">
                            {selectedPost !== null && selectedPost.caption && (
                                <div>
                                    <div className="w-full px-6 mt-4 text-[15px]">
                                        <div className="flex flex-row gap-4 items-start">
                                            <img src={postData?.profilePic} alt="Profile Picture" className="w-9 rounded-full" />
                                            <p>
                                                <span className="text-[14px] font-semibold mr-3 cursor-default">{postData?.userName}</span>
                                                {selectedPost.caption}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col gap-4 ml-5 pt-2">
                                <CommentsStructure handleClick={handleClick} />
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
                                        <p className="text-[15px] font-semibold">{selectedPost.likeCount} likes</p>
                                        <p className="text-[12px] text-[#A8A8A8]">{formatDate(selectedPost.createdAt)} ago</p>
                                    </div>
                                )}
                            </div>
                            <PostComment commentRef={commentRef} />
                        </div>
                    </div>
                </div >
            </div>
            <PostSettings
                isPostSettingOpen={isPostSettingOpen}
                isMyPost={isMyPost}
                setIsPostSettingOpen={setIsPostSettingOpen}
                setIsPostOpen={setIsPostOpen}
            />
        </>
    );

}