import { SharePhotosIcon, TaggedIcon } from "../../assets/Constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { Post } from "../post/Post";
import { IoSaveOutline } from "react-icons/io5";
import { PostModal } from "../post/PostModal";
import { usePost } from "../../context/PostContext";
import { useSearch } from "../../context/SearchContext";
import { useHome } from "../../context/HomeContext";

interface ProfileTabsProps {
    isPosts?: boolean;
    isTagged?: boolean;
    isSaved?: boolean;
    isSearchPosts?: boolean;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ isPosts, isTagged, isSaved, isSearchPosts }) => {
    const { selectedPost, setSelectedPost, setComments } = usePost()
    const { setPage, setTotalPages } = useHome()
    const { searchUserPosts, selectedProfile } = useSearch()
    const { userPosts, userData, userSaves } = useUser();
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
    const [currentPost, setCurrentPost] = useState<number | any>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const reversedPosts = userPosts?.slice().reverse() || [];
    const reversedUserPosts = searchUserPosts?.slice().reverse() || [];
    const reversedSavedPosts = userSaves?.slice().reverse() || [];

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
        setTotalPages(0)
    }

    function handleDecrease() {
        setCurrentPost((prev) => prev - 1)
        setCurrentIndex(0)
        setComments([])
        setPage(1);
        setTotalPages(0)
    }

    return <>
        {(isPosts && userPosts.length === 0) || (isTagged && userPosts.length === 0) || (isSaved && reversedSavedPosts.length === 0) || (isSearchPosts && searchUserPosts.length === 0) ?
            <div className="max-w-[100%] flex flex-col gap-4 items-center justify-center xl:h-[34vh] h-[23vh]">
                {isPosts ? <SharePhotosIcon /> : isTagged ? <TaggedIcon /> : isSaved ? <IoSaveOutline className="text-[50px]" />
                    : isSearchPosts ? <SharePhotosIcon /> : ""}
                <h1 className="text-[25px] font-extrabold">{isPosts ? "Share photos" : isTagged ? "Photos of you" : isSaved ? "Saved Posts" : isSearchPosts ? "No posts yet" : ""}</h1>
                <p className="text-[13px]">{isPosts ? "When you share photos, they will appear on your profile." : isTagged ? "When people tag you in photos, they'll appear here." : isSaved ? "When you save posts, they will appear on your profile" : ""}</p>
            </div> :
            <div className="xl:max-w-[100%] mb-16 md:mb-0 h-auto grid lg:grid-cols-3 grid-cols-2 gap-[10px]">
                {isPosts ? reversedPosts.map((item, i, arr) =>
                    <PostModal key={i} i={i} arr={arr} item={item} setSelectedPost={setSelectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} setTotalPages={setTotalPages} />) :
                    isTagged ? reversedPosts.map((item, i, arr) =>
                        <PostModal key={i} i={i} arr={arr} item={item} setSelectedPost={setSelectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} />) :
                        isSaved ? reversedSavedPosts.map((item, i, arr) =>
                            <PostModal key={i} i={i} arr={arr} item={item} setSelectedPost={setSelectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} />) :
                            isSearchPosts ? reversedUserPosts.map((item, i, arr) =>
                                <PostModal key={i} i={i} arr={arr} item={item} setSelectedPost={setSelectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} />) :
                                ""}
            </div>
        }

        <Post
            isPostOpen={isPostOpen}
            setIsPostOpen={setIsPostOpen}
            postData={isPosts || isTagged ? userData?.data?.user ?? {} : isSearchPosts ? selectedProfile ?? {} : isSaved ? userSaves?.[currentPost]?.postBy ?? {} : {}}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            currentPost={currentPost}
            setCurrentPost={setCurrentPost}
        />


        {selectedPost !== null &&
            (
                (isPosts || isTagged ? reversedPosts && reversedPosts.length > 1 : isSearchPosts ? reversedUserPosts && reversedUserPosts.length > 1 : isSaved ? reversedSavedPosts.length > 1 : false)
                && (
                    <>
                        {((isPosts && currentPost !== userPosts.length - 1) || (isTagged && currentPost !== userPosts.length - 1) || (isSaved && currentPost !== userSaves.length - 1) ||
                            (isSearchPosts && currentPost !== searchUserPosts.length - 1)) && (
                                <button
                                    className={`fixed z-[100] right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none"} xl:block hidden`}
                                    onClick={handleIncrease}
                                >
                                    <FaArrowRight className="fill-black" />
                                </button>
                            )}

                        {currentPost !== 0 && (
                            <button
                                className={`fixed z-[100] left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none"} xl:block hidden`}
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