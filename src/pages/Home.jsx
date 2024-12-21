import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/helpers/Loader";
import { RiUserFollowFill } from "react-icons/ri";
import { Post } from "../components/post/Post";
import { fetchHomePosts, fetchStories } from "../services/homePage";
import { HomePost } from "../components/post/HomePost";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { HomeStories } from "../components/story/HomeStories";
import { useHome } from "../context/HomeContext";

export function Home() {
    const { userData } = useUser()
    const { homeStories, setHomeStories, totalPages, setTotalPages, homePosts, setHomePosts, page, setPage } = useHome()
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [isPostsLoading, setIsPostsLoading] = useState(true)
    const [isPostOpen, setIsPostOpen] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setIsPostsLoading(true)
        fetchHomePosts(userData, setHomePosts, setIsPostsLoading, setHasMore)
        fetchStories(userData, setHomeStories)
    }, [])

    return <>
        <PostPageHeader isArrowNeeded={false} isHomePage={true} />
        {homeStories.length > 0 && <HomeStories />}
        <section className="w-full lg:max-w-[40%] sm:max-w-[85%] max-w-[95%] mt-5 md:mt-0 mb-20 md:mb-2 mx-auto">
            <div className={`flex flex-col gap-2 w-full ${isPostsLoading || homePosts.length === 0 ? "h-[90vh]" : ""} ${homePosts.length < 2 ? "h-[90vh]" : ""}`}>
                {!isPostsLoading ?
                    <InfiniteScroll dataLength={homePosts.length} loader={homePosts.length > 0 && <Loader height="md:h-[10vh] h-[15vh] overflow-scroll scrollbar-hidden" />} next={() => {
                        fetchHomePosts(userData, setHomePosts, setIsPostsLoading, setHasMore)
                    }} hasMore={hasMore} >
                        {
                            homePosts.length > 0 ? homePosts.map((item, index, arr) => (
                                <HomePost arr={arr} key={index} index={index} item={item} homePosts={homePosts} setHomePosts={setHomePosts} setCurrentPost={setCurrentPost} setCurrentPostIndex={setCurrentPostIndex} setIsPostOpen={setIsPostOpen} />
                            )) : ''}

                    </InfiniteScroll>
                    : <Loader />}
                {
                    homePosts.length === 0 && !isPostsLoading &&
                    <div className="absolute top-20 left-[50%] -translate-x-1/2 text-center flex flex-col items-center gap-1">
                        <RiUserFollowFill className="text-[40px]" />
                        <h2 className="text-[40px] font-semibold">Follow Someone</h2>
                    </div>
                }
            </div>
        </section>
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={homePosts[currentPost]?.user} page={page} setPage={setPage} currentIndex={currentPostIndex} setCurrentIndex={setCurrentPostIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} totalPages={totalPages} setTotalPages={setTotalPages} />
    </>
}