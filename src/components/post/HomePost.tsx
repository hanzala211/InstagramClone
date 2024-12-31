import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { CommentHome } from "../comments/CommentHome"
import { usePost } from "../../context/PostContext"
import { Like, SaveSVG, ShareIcon, UnLike, UnSave } from "../../assets/Constants"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { formatDate } from "../../utils/helper"
import { useEffect, useRef, useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { LikeAnimation } from "./LikeAnimation"
import { PostComment } from "../comments/PostComment"
import { savePost, unSavePost, likePost, unLikePost } from "../../services/homePage"
import { fetchComments } from "../../services/post"
import { fetchUserDataOnClick } from "../../services/searchProfile"
import { SearchChat } from "../chats/SearchChat"
import { PostCaption } from "./PostCaption"
import { useHome } from "../../context/HomeContext"
import { useSearch } from "../../context/SearchContext"
import { CommentDrawerOpener } from "./CommentDrawerOpener"
import { Post } from "../../types/postType"
import { UserHoverModal } from "../usermodals/UserHoverModal"

interface HomePostProps {
    index: number;
    item: Post;
    homePosts: Post[];
    setHomePosts: (value: Post[]) => void;
    setCurrentPost: (value: number) => void;
    setCurrentPostIndex: (value: number) => void;
    setIsPostOpen: (value: boolean) => void;
    isPost?: boolean;
}

export const HomePost: React.FC<HomePostProps> = ({ index, item, homePosts, setHomePosts, setCurrentPost, setCurrentPostIndex, setIsPostOpen, isPost }) => {
    const { setSelectedPost, selectedPost, setComments, setCommentsLoading, isCommented, setIsShareOpenHome } = usePost()
    const { userData, setMainLoading, setUserData, setMessage, innerWidth } = useUser()
    const { setSelectedProfile } = useSearch()
    const { page, setTotalPages } = useHome()
    const [isAnimating, setIsAnimating] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number[]>(Array(homePosts.length).fill(0))
    const [totalIndex, setTotalIndex] = useState<number[]>(Array(homePosts.length).fill(0))
    const [savedPosts, setSavedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [likedPosts, setLikedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [isHovered, setIsHovered] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [heartIndex, setHeartIndex] = useState<number>(0);
    const lastTouchTime = useRef<number>(0);
    const commentRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (homePosts !== null) {
            const updatedLikedPosts = homePosts.map(post => post.likes.includes(userData?.data.user._id))
            const updatedSavedPosts = homePosts.map(post => userData.data.user.savedPosts.includes(post._id))
            const updatedCurrentIndex = homePosts.map(post => post?.imageUrls.length)

            setLikedPosts(updatedLikedPosts)
            setSavedPosts(updatedSavedPosts)
            setTotalIndex(updatedCurrentIndex)
            setCurrentIndex(Array(homePosts.length).fill(0))
            setIsHovered(Array(homePosts.length).fill(false))
            setIsShareOpenHome(Array(homePosts.length).fill(false))
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

    const handleDoubleClick = (id: string, indexForClick: number) => {
        setHeartIndex(indexForClick);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!likedPosts[indexForClick]) {
            likePost(id, indexForClick, setLikedPosts,
                setHomePosts,
                userData,
                setMessage)
        }
    };

    function handleIncrease(index: number) {
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

    function handleDecrease(index: number) {
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

    const handleMouseEnter = (index: number) => {
        setIsHovered((prev) => {
            const updated = [...prev]
            updated[index] = true;
            return updated;
        });
    };

    const handleMouseLeave = (index: number) => {
        setIsHovered((prev) => {
            const updated = [...prev]
            updated[index] = false;
            return updated;
        })
    };

    const handleHoverCardClick = () => {
        fetchUserDataOnClick(item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName, userData, null, setSelectedProfile, setMainLoading)
        setMainLoading(true)
        navigate(`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`)
    }

    return <>
        <div className={`flex flex-col gap-2 ${index === 0 ? "" : "mt-5"} ${isPost ? "" : "border-b-[2px] border-[#262626]"} pb-4`}>
            <div className={`flex flex-row items-center gap-2`}>
                <img src={item?.user?.profilePic || item?.postBy?.profilePic || userData?.data?.user?.profilePic} className="rounded-full w-10" alt="" />
                <div className="flex flex-row gap-1 items-center relative">
                    <HoverCard>
                        <HoverCardTrigger>
                            <Link to={`/search/${item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}/`} onClick={handleHoverCardClick} className="font-semibold text-[12px] hover:opacity-70 transition duration-200" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>{item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName}</Link>
                        </HoverCardTrigger>
                        <div onClick={handleHoverCardClick} className="absolute z-[50]">
                            <HoverCardContent>
                                <UserHoverModal username={item?.user?.userName || item?.postBy?.userName || userData?.data.user?.userName} isHovered={isHovered[index]} />
                            </HoverCardContent>
                        </div>
                        <p className="text-[#A8A8A8]">•</p>
                        <p className="text-[#a8a8a8] text-[13px] font-medium">{formatDate(item?.createdAt)}</p>
                    </HoverCard>
                </div>
            </div>
            <div className={`w-full bg-[#000000] border-[1px] border-[#2B2B2D] relative overflow-hidden ${isPost ? "" : "rounded-md"}`}>
                <div className={`w-full ${isPost ? "440:h-[30rem] max-h-[23rem]" : "h-full"} flex items-start ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex[index] * 100}%)` }}>
                    {item !== null ? item?.imageUrls?.map((item, i) => {
                        return <div className="relative flex-shrink-0 w-full h-full"
                            key={i}>
                            <img onDoubleClick={() => handleDoubleClick(homePosts[index]._id, index)}
                                onTouchStart={() => {
                                    const currentTime = Date.now();
                                    const timeDifference = currentTime - lastTouchTime.current;
                                    if (timeDifference < 300 && timeDifference > 0) {
                                        handleDoubleClick(homePosts[index]._id, index)
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
                            <button onClick={() => likePost(item._id, index, setLikedPosts, setHomePosts, userData, setMessage)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer mb-1`} /></button>
                            : <button onClick={() => unLikePost(item._id, index, setLikedPosts,
                                setHomePosts,
                                userData,
                                setMessage)}><UnLike className={`hover:opacity-80 fill-red-700 mb-1 transition-all duration-150 cursor-pointer`} /></button>}
                        {innerWidth >= 770 && <span onClick={() => setSelectedPost(item)}><CommentHome setCurrentIndex={setCurrentPostIndex} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} i={index} /></span>}
                        <CommentDrawerOpener item={item} setCurrentPost={setCurrentPost} index={index} setCurrentPostIndex={setCurrentPostIndex} isText={false} />
                        <button onClick={() => {
                            setSelectedPost(item)
                            setIsShareOpenHome((prev) => {
                                const updated = [...prev]
                                updated[index] = true;
                                return updated;
                            })
                        }} className="hover:opacity-70 transition duration-300 mb-0.5"><ShareIcon /></button>
                    </div>
                    {!savedPosts[index] ?
                        <button onClick={() => savePost(item._id, index, setSavedPosts, setUserData, userData, setMessage)}>
                            <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
                        </button> : <button onClick={() => unSavePost(item._id, index, setSavedPosts, userData, setUserData, setMessage)}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
                    }
                </div>
                <p className="text-[14px] font-medium">{item.likeCount} likes</p>
                <div className="w-full text-[15px]">
                    <PostCaption selectedPost={item} postData={item?.user || item?.postBy || userData?.data?.user} isImg={false} />
                    <CommentDrawerOpener item={item} setCurrentPost={setCurrentPost} index={index} setCurrentPostIndex={setCurrentPostIndex} isText={true} />
                    {!isPost &&
                        <div className={`md:hidden ${item.commentsCount > 1 ? "" : "-mt-3"}`}>
                            <PostComment commentRef={commentRef} item={item} />
                        </div>}
                </div>
            </div>
        </div>
        <SearchChat index={index} header="Share" isChat={false} />
    </>
}