import { useEffect, useRef, useState } from "react";
import { MoreCommentsSVG } from "../../assets/Constants";
import { PostSettings } from "./PostSettings";
import { usePost } from "../../context/PostContext";
import { Overlay } from "../helpers/Overlay";
import { PostSlider } from "./PostSlider";
import { CommentsStructure } from "../comments/CommentsStructure";
import { PostUserCard } from "./PostUserCard";
import { PostCaption } from "./PostCaption";
import { SearchChat } from "../chats/SearchChat";
import { PostUserData } from "../../types/postType";
import { UserInfo } from "../../types/user";
import { PostInteractionSection } from "./PostInteractionSection";
import { useAuth } from "../../context/AuthContext";
import { getDataOnClick } from "../../services/searchProfile";

interface PostProps {
    isPostOpen: boolean;
    setIsPostOpen: (value: boolean) => void;
    postData: PostUserData | UserInfo | any;
    setCurrentPost: (value: number | null) => void;
    currentPost: number | null;
    isMobile?: boolean
}

export const Post: React.FC<PostProps> = ({ isPostOpen, setIsPostOpen, postData, setCurrentPost, currentPost, isMobile }) => {
    const { selectedPost, setSelectedPost, setIsMyPost, setIsSaved, setCommentValue, setIsPostSettingOpen, isCommented, commentsLoading, isPostSettingOpen, isMyPost, comments, setComments, isLiked, page, setPage, totalPages, setTotalPages, fetchComments } = usePost();
    const { userData, setMainLoading, token, setSelectedProfile } = useAuth();
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const commentRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (selectedPost !== null) {
            const isUserPost = selectedPost?.postBy?._id === userData.data.user._id;
            setIsMyPost(isUserPost);
            setIsSaved(userData.data.user.savedPosts.includes(selectedPost?._id));
            setIsMyPost(isUserPost || selectedPost?.user?._id === userData.data.user._id);
        }
    }, [selectedPost?._id, userData]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (selectedPost !== null) {
            fetchComments(signal);
        }
        return () => {
            controller.abort();
        };
    }, [page, selectedPost?._id, currentPost, userData?.data.token, isCommented]);

    function handleClose() {
        setIsPostOpen(false);
        setTimeout(() => {
            setCurrentPost(null);
            setSelectedPost(null);
            setCommentValue("");
            setComments([]);
            setTotalPages(0);
            setPage(1);
        }, 200);
        setIsPostSettingOpen(false);
    }

    const fetchUserDataOnClick = async (item: any) => {
        try {
            setMainLoading(true);
            const res = await getDataOnClick({
                username: item ? item?.user.userName : postData?.userName,
                token
            })
            setSelectedProfile(res.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setMainLoading(false);
            }, 1000);
        }
    }


    function handleClick(item: any, postData: any) {
        setMainLoading(true);
        fetchUserDataOnClick(item);
        setSelectedPost(null);
    }

    return (
        <>
            {!isMobile && <Overlay handleClose={handleClose} isPostOpen={isPostOpen} />}
            <div
                className={`${isMobile ? "1280:max-w-[100rem]" : "fixed 1280:max-w-[84rem] opacity-0 top-[40%] md:top-[45%] 1280:top-[32%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150]"
                    } w-full lg:max-w-[68rem] md:h-[30rem] md:max-w-[52rem] h-[30rem] max-w-[27rem] ${isPostOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none"}`}
            >
                <div className="flex flex-col md:flex-row">
                    <div className="flex md:hidden relative px-2 mb-2 justify-between items-center">
                        <PostUserCard
                            postData={postData}
                            setIsHovered={setIsHovered}
                            handleClick={handleClick}
                            isHovered={isHovered}
                            setIsPostSettingOpen={setIsPostSettingOpen}
                        />
                    </div>
                    <PostSlider post={selectedPost} isLiked={isLiked} isHome={false} />

                    <div className="1280:w-[45rem] lg:w-[60rem] md:w-[65rem] hidden md:block w-[22rem] bg-[#000000]">
                        <div className="flex relative justify-between items-center p-5 border-b-[1px] border-[#262626]">
                            <PostUserCard
                                postData={postData}
                                setIsHovered={setIsHovered}
                                handleClick={handleClick}
                                isHovered={isHovered}
                                setIsPostSettingOpen={setIsPostSettingOpen}
                            />
                        </div>
                        <div className={`w-full flex flex-col ${isMobile ? "h-[45vh]" : "1280:h-[60.5vh] lg:h-[40vh] h-[35vh]"} gap-4 overflow-auto scrollbar-hidden`}>
                            <PostCaption isImg={true} postData={postData} selectedPost={selectedPost} />
                            <div className="flex flex-col gap-4 ml-5 pt-2">
                                <CommentsStructure handleClick={handleClick} />
                                <div className="w-full flex justify-center items-center mb-2">
                                    {page !== totalPages && !commentsLoading && comments?.length !== 0 && (
                                        <button className="hover:opacity-55 transition-all duration-150" onClick={() => setPage((prev) => prev + 1)}>
                                            <MoreCommentsSVG />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border-t-[1px] h-[10rem] border-[#262626] w-full bg-[#000]">
                            <PostInteractionSection isCaption={false} postData={postData} commentRef={commentRef} />
                        </div>
                    </div>
                </div>
                <div className="border-t-[1px] h-[10rem] md:hidden block border-[#262626] w-full bg-[#000]">
                    <PostInteractionSection isCaption={true} postData={postData} commentRef={commentRef} />
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
