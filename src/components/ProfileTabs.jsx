import { SharePhotosIcon, TaggedIcon } from "../assets/Constants";
import { PiCopySimpleLight } from "react-icons/pi";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { TbMessageCircleFilled } from "react-icons/tb";
import { usePost, useSearch, useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Post } from "./Post";
import { IoSaveOutline } from "react-icons/io5";

export function ProfileTabs({ isPosts, isTagged, isSaved, isSearchPosts }) {
    const { selectedPost, setSelectedPost } = usePost()
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { userPosts, userData, userSaves } = useUser();
    const [page, setPage] = useState(1);
    const { searchUserPosts, selectedProfile } = useSearch()
    const [totalPages, setTotalPages] = useState(null);
    const reversedPosts = userPosts?.slice().reverse() || [];
    const reversedUserPosts = searchUserPosts?.slice().reverse() || [];
    const [comments, setComments] = useState([])
    const reversedSavedPosts = userSaves?.slice().reverse() || [];
    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1) + 'B';
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1) + ' M';
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }
    useEffect(() => {
        if (currentPost !== null && currentPost < reversedPosts.length && isPosts) {
            setSelectedPost(reversedPosts[currentPost])
        } else if (currentPost !== null && currentPost < reversedSavedPosts.length && isSaved) {
            setSelectedPost(reversedSavedPosts[currentPost])
        } else if (currentPost !== null && currentPost < reversedUserPosts.length && isSearchPosts) {
            setSelectedPost(reversedUserPosts[currentPost])
        }
    }, [currentPost])
    function handleIncrease() {
        setCurrentPost((prev) => prev + 1)
        setCurrentIndex(0)
        setComments([])
        setPage(1);
        setTotalPages(null)
    }
    function handleDecrease() {
        setCurrentPost((prev) => prev - 1)
        setCurrentIndex(0)
        setComments([])
        setPage(1);
        setTotalPages(null)
    }
    return <>
        {(isPosts && userPosts.length === 0) || (isTagged && userPosts.length === 0) || (isSaved && reversedSavedPosts.length === 0) || (isSearchPosts && searchUserPosts.length === 0) ? <div className="max-w-[100%] flex flex-col gap-4 items-center justify-center h-[42vh]">
            {isPosts ? <SharePhotosIcon /> : isTagged ? <TaggedIcon /> : isSaved ? <IoSaveOutline className="text-[50px]" />
                : isSearchPosts ? <SharePhotosIcon /> : ""}
            <h1 className="text-[25px] font-extrabold">{isPosts ? "Share photos" : isTagged ? "Photos of you" : isSaved ? "Saved Posts" : isSearchPosts ? "No posts yet" : ""}</h1>
            <p className="text-[13px]">{isPosts ? "When you share photos, they will appear on your profile." : isTagged ? "When people tag you in photos, they'll appear here." : isSaved ? "When you save posts, they will appear on your profile" : ""}</p>
        </div> :
            <div className="xl:max-w-[90%] h-auto grid xl:grid-cols-3 grid-cols-2 gap-[15px]">
                {isPosts ? reversedPosts.map((item, i, arr) => {
                    return (
                        <div key={i} className="w-[20rem] h-[20rem] cursor-pointer group relative overflow-hidden" onClick={() => {
                            setSelectedPost(arr[i]);
                            setIsPostOpen(true)
                            setCurrentPost(i);
                        }}>
                            <div className="absolute right-3 top-2">
                                {item.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[25px]" /> : ""}
                            </div>
                            <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item.likeCount)}</p>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item.commentsCount)}</p>
                            </div>
                            <img
                                src={item.imageUrls[0]}
                                alt={item.caption}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    );
                }) : isTagged ? reversedPosts.map((item, i, arr) => {
                    return <div key={i} className="w-[20rem] h-[20rem] cursor-pointer group relative overflow-hidden"
                        onClick={() => {
                            setSelectedPost(arr[i]);
                            setIsPostOpen(true)
                            setCurrentPost(i);
                        }}>
                        <div className="absolute right-3 top-2">
                            {item.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[25px]" /> : ""}
                        </div>
                        <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                            <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item.likeCount)}</p>
                            <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item.commentsCount)}</p>
                        </div>
                        <img
                            src={item.imageUrls[0]}
                            alt="User Data"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                }) : isSaved ? reversedSavedPosts.map((item, i, arr) => {
                    return (
                        <div key={i} className="w-[20rem] h-[20rem] cursor-pointer group relative overflow-hidden" onClick={() => {
                            setSelectedPost(arr[i]);
                            setIsPostOpen(true)
                            setCurrentPost(i);
                        }}>
                            <div className="absolute right-3 top-2">
                                {item.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[25px]" /> : ""}
                            </div>
                            <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item.likeCount)}</p>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item.commentsCount)}</p>
                            </div>
                            <img
                                src={item.imageUrls[0]}
                                alt={item.caption}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    );
                }) : isSearchPosts ? reversedUserPosts.map((item, i, arr) => {
                    return (
                        <div key={i} className="w-[20rem] h-[20rem] cursor-pointer group relative overflow-hidden" onClick={() => {
                            setSelectedPost(arr[i]);
                            setIsPostOpen(true)
                            setCurrentPost(i);
                        }}>
                            <div className="absolute right-3 top-2">
                                {item.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[25px]" /> : ""}
                            </div>
                            <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item.likeCount)}</p>
                                <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item.commentsCount)}</p>
                            </div>
                            <img
                                src={item.imageUrls[0]}
                                alt={item.caption}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    );
                }) : ""}
            </div>}
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={isPosts ? userData.data.user : isSearchPosts ? selectedProfile : isSaved ? userSaves[currentPost]?.postBy : ""} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} page={page} setPage={setPage} totalPages={totalPages} setTotalPages={setTotalPages} comments={comments} setComments={setComments} />
        {selectedPost !== null &&
            (
                (isPosts || isTagged
                    ? reversedPosts && reversedPosts.length > 1
                    : isSearchPosts
                        ? reversedUserPosts && reversedUserPosts.length > 1
                        : isSaved
                            ? reversedSavedPosts.length > 1
                            : false
                ) && (
                    <>
                        {((isPosts && currentPost !== userPosts.length - 1) || (isSaved && currentPost !== userSaves.length - 1) ||
                            (isSearchPosts && currentPost !== searchUserPosts.length - 1)) && (
                                <button
                                    className={`fixed z-[100] right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none"
                                        }`}
                                    onClick={handleIncrease}
                                >
                                    <FaArrowRight className="fill-black" />
                                </button>
                            )}

                        {currentPost !== 0 && (
                            <button
                                className={`fixed z-[100] left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none"
                                    }`}
                                onClick={handleDecrease}
                            >
                                <FaArrowLeft className="fill-black" />
                            </button>
                        )}
                    </>
                )
            )
        }

    </>
}