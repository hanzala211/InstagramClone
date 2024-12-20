import { useEffect, useRef, useState } from "react";
import { MoreCommentsSVG } from "../../assets/Constants";
import { PostSettings } from "./PostSettings";
import { useSearch, useUser } from "../../context/UserContext";
import { formatDate } from "../../utils/helper";
import { usePost } from "../../context/PostContext";
import { PostComment } from "../comments/PostComment";
import { PostOptions } from "./PostOptions";
import { Overlay } from "../helpers/Overlay";
import { PostSlider } from "./PostSlider";
import { CommentsStructure } from "../comments/CommentsStructure";
import { fetchComments } from "../../services/post";
import { fetchUserDataOnClick } from "../../services/searchProfile";
import { SearchChat } from "../chats/SearchChat";
import { PostUserCard } from "./PostUserCard";
import { PostCaption } from "./PostCaption";

export function Post({ isPostOpen, setIsPostOpen, postData, currentIndex, setCurrentIndex, setCurrentPost, page, setPage, totalPages, setTotalPages, currentPost, isMobile }) {
    const { selectedPost, setSelectedPost, setIsMyPost, setIsSaved, setCommentValue, setIsPostSettingOpen, isCommented, commentsLoading, setCommentsLoading, isPostSettingOpen, isMyPost, comments, setComments } = usePost()
    const { userData, setMainLoading } = useUser();
    const { setSelectedProfile } = useSearch()
    const [isHovered, setIsHovered] = useState(false)
    const commentRef = useRef(null);

    useEffect(() => {
        if (selectedPost !== null) {
            setIsMyPost(selectedPost?.postBy?._id === userData.data.user._id)
            setIsSaved(userData.data.user.savedPosts.includes(selectedPost?._id))
            setIsMyPost(selectedPost?.postBy === userData.data.user._id)
            setIsMyPost(selectedPost?.user?._id === userData.data.user._id || selectedPost?.postBy?._id === userData.data.user._id || selectedPost?.postBy === userData.data.user._id)
        }
    }, [selectedPost?._id])

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
            {!isMobile && <Overlay handleClose={handleClose} isPostOpen={isPostOpen} />}
            <div className={`${isMobile ? "1280:max-w-[100rem]" : "fixed 1280:max-w-[90rem] opacity-0 top-[40%] md:top-1/2 1280:top-[35%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150]"} w-full lg:max-w-[68rem] lg:h-[35rem] md:h-[30rem] md:max-w-[52rem] h-[30rem] max-w-[27rem] ${isPostOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none"}`}>
                <div className="flex flex-col md:flex-row">
                    <div className="flex md:hidden relative px-2 mb-2 justify-between items-center">
                        <PostUserCard postData={postData} setIsHovered={setIsHovered} handleClick={handleClick} isHovered={isHovered} setIsPostSettingOpen={setIsPostSettingOpen} />
                    </div>
                    <PostSlider currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                    <div className="1280:w-[45rem] lg:w-[60rem] md:w-[65rem] hidden md:block w-[22rem] bg-[#000000]">
                        <div className="flex relative  justify-between items-center p-5 border-b-[1px] border-[#262626]">
                            <PostUserCard postData={postData} setIsHovered={setIsHovered} handleClick={handleClick} isHovered={isHovered} setIsPostSettingOpen={setIsPostSettingOpen} />
                        </div>
                        <div className={`w-full flex flex-col ${isMobile ? "h-[45vh]" : "1280:h-[60.5vh] lg:h-[40vh] h-[35vh]"} gap-4 overflow-auto scrollbar-hidden`}>
                            <PostCaption isImg={true} postData={postData} selectedPost={selectedPost} />
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
                        <div className="border-t-[1px] h-[10rem] border-[#262626] w-full bg-[#000]">
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
                <div className="border-t-[1px] h-[10rem] md:hidden block border-[#262626] w-full bg-[#000]">
                    <PostOptions postData={postData} commentRef={commentRef} />
                    <div>
                        {selectedPost !== null && (
                            <div className="mt-2 px-2">
                                <p className="text-[15px] font-semibold">{selectedPost.likeCount} likes</p>
                                <p className="text-[12px] text-[#a8a8a8]">{formatDate(selectedPost.createdAt)} ago</p>
                            </div>
                        )}
                    </div>
                    <PostCaption selectedPost={selectedPost} postData={postData} isImg={false} />
                    <PostComment commentRef={commentRef} />
                </div>
            </div>
            <PostSettings
                isPostSettingOpen={isPostSettingOpen}
                isMyPost={isMyPost}
                setIsPostSettingOpen={setIsPostSettingOpen}
                setIsPostOpen={setIsPostOpen}
            />
            <SearchChat header="Share" isChat={false} />
        </>
    );

}