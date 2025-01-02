import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { usePost } from "../../context/PostContext"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { formatDate } from "../../utils/helper"
import { useEffect, useRef, useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { PostComment } from "../comments/PostComment"
import { fetchComments } from "../../services/post"
import { fetchUserDataOnClick } from "../../services/searchProfile"
import { SearchChat } from "../chats/SearchChat"
import { PostCaption } from "./PostCaption"
import { useHome } from "../../context/HomeContext"
import { useSearch } from "../../context/SearchContext"
import { CommentDrawerOpener } from "./CommentDrawerOpener"
import { Post } from "../../types/postType"
import { UserHoverModal } from "../usermodals/UserHoverModal"
import { HomePostOptions } from "./HomePostOptions"
import { PostSlider } from "./PostSlider"

interface HomePostProps {
    index: number;
    item: any;
    setHomePosts: (value: Post[]) => void;
    setCurrentPost: (value: number) => void;
    setCurrentPostIndex: (value: number) => void;
    setIsPostOpen: (value: boolean) => void;
    isPost?: boolean;
}

export const HomePost: React.FC<HomePostProps> = ({ index, item, setCurrentPost, setCurrentPostIndex, setIsPostOpen, isPost }) => {
    const { selectedPost, setComments, setCommentsLoading, isCommented, setIsShareOpenHome } = usePost()
    const { userData, setMainLoading } = useUser()
    const { setSelectedProfile } = useSearch()
    const { page, setTotalPages, homePosts } = useHome()
    const [currentIndex, setCurrentIndex] = useState<number[]>(Array(homePosts.length).fill(0))
    const [totalIndex, setTotalIndex] = useState<number[]>(Array(homePosts.length).fill(0))
    const [savedPosts, setSavedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [likedPosts, setLikedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [isHovered, setIsHovered] = useState<boolean[]>(Array(homePosts.length).fill(false))
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

            <PostSlider currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} post={item} isLiked={likedPosts} setIsLiked={setLikedPosts} index={index} totalIndex={totalIndex} isHome={true} />

            <div className="flex flex-col gap-2 w-full">

                <HomePostOptions likedPosts={likedPosts} index={index} item={item} setLikedPosts={setLikedPosts} savedPosts={savedPosts} setCurrentPostIndex={setCurrentPostIndex} setCurrentPost={setCurrentPost} setSavedPosts={setSavedPosts} setIsPostOpen={setIsPostOpen} />

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