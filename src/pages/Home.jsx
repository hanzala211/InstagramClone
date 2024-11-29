import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/Loader";
import { RiUserFollowFill } from "react-icons/ri";
import { Post } from "../components/Post";
import { fetchHomePosts } from "../utils/helper";
import { HomePost } from "../components/HomePost";

export function Home() {
    const { userData } = useUser()
    const [homePosts, setHomePosts] = useState([])
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [isPostsLoading, setIsPostsLoading] = useState(false)
    const [isPostOpen, setIsPostOpen] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [comments, setComments] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setIsPostsLoading(true)
        fetchHomePosts(userData, setHomePosts, setIsPostsLoading, setHasMore)
    }, [])

    return <><section className="w-full max-w-[40%] mx-auto">
        <div className={`flex flex-col gap-2 w-full ${isPostsLoading || homePosts.length === 0 ? "h-[90vh]" : ""} ${homePosts.length < 2 ? "h-[90vh]" : ""}`}>
            {!isPostsLoading ?
                <InfiniteScroll dataLength={homePosts.length} loader={homePosts.length > 0 && <Loader height="h-[10vh]" />} next={() => {
                    fetchHomePosts(userData, setHomePosts, setIsPostsLoading, setHasMore)
                }} hasMore={hasMore} >
                    {
                        homePosts.length > 0 ? homePosts.map((item, index) => (
                            <HomePost key={index} index={index} item={item} homePosts={homePosts} setHomePosts={setHomePosts} setCurrentPost={setCurrentPost} setCurrentPostIndex={setCurrentPostIndex} setIsPostOpen={setIsPostOpen} />
                        )) : ''}

                </InfiniteScroll>
                : <Loader />}
            {
                homePosts.length === 0 && !isPostsLoading &&
                <div className="absolute top-20 left-[50%] flex flex-col items-center gap-1">
                    <RiUserFollowFill className="text-[40px]" />
                    <h2 className="text-[40px] font-semibold">Follow Someone</h2>
                </div>
            }
        </div>
    </section>
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={homePosts[currentPost]?.user} page={page} setPage={setPage} currentIndex={currentPostIndex} setCurrentIndex={setCurrentPostIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} totalPages={totalPages} setTotalPages={setTotalPages} comments={comments} setComments={setComments} />
    </>
}