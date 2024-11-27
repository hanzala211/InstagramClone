import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/Loader";
import { PiCopySimpleLight } from "react-icons/pi";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { TbMessageCircleFilled } from "react-icons/tb";
import { Post } from "../components/Post";
import { formatNumber } from "../utils/helper";
import { usePost } from "../context/PostContext";

export function Explore() {
    const { userData } = useUser();
    const { setSelectedPost, selectedPost } = usePost()
    const [explorePagePosts, setExplorePagePosts] = useState([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [currentPost, setCurrentPost] = useState(0);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [comments, setComments] = useState([]);
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setIsPostsLoading(true)
        fetchPosts();
    }, [])

    useEffect(() => {
        if (currentPost !== null && currentPost < explorePagePosts.length) {
            setSelectedPost(explorePagePosts[currentPost])
        }
    }, [currentPost])

    async function fetchPosts() {
        try {
            setCount((prev) => prev + 1)
            const response = await fetch(
                `https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/explore?limit=6`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${userData.data.token}`,
                    },
                    redirect: 'follow',
                }
            );
            const result = await response.json();
            if (result.status !== 'fail') {
                setExplorePagePosts((prev) => {
                    const newItems = result.data.filter(
                        (item) => !prev.some((prevItem) => prevItem._id === item._id)
                    );
                    if (newItems.length === 0) {
                        setHasMore(false);
                        return [...prev];
                    } else {
                        return [...prev, ...newItems];
                    }
                });
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPostsLoading(false);
        }
    }

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

    return <><section className={`w-full max-w-[65%] mt-10 mx-auto ${isPostsLoading || explorePagePosts.length === 0 ? "h-[85vh]" : ""} ${explorePagePosts.length < 5 ? "xl:h-[95vh]" : ""}`}>
        {explorePagePosts.length === 0 && !isPostsLoading ? (
            <p className="text-center text-lg text-gray-500">
                No posts available. Check back later!
            </p>
        ) : isPostsLoading ? <Loader /> : (
            <InfiniteScroll
                dataLength={explorePagePosts.length}
                next={fetchPosts}
                loader={
                    <div className="flex justify-center py-4">
                        <Loader height="h-[5vh]" />
                    </div>
                }
                hasMore={count < 8 && hasMore}
            >
                <div className={`flex flex-wrap gap-2`}>
                    {explorePagePosts.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="w-[20rem] h-[20rem] cursor-pointer group relative overflow-hidden"
                            onClick={() => {
                                setSelectedPost(item);
                                setIsPostOpen(true);
                                setCurrentPost(index);
                            }}
                            aria-label={`Open post ${item.caption}`}
                        >
                            {item.imageUrls.length > 1 && (
                                <div className="absolute right-3 top-2">
                                    <PiCopySimpleLight className="text-[25px]" />
                                </div>
                            )}
                            <div
                                className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100 bg-black/30"
                            >
                                <p className="text-[17px] font-semibold flex items-center gap-2 text-white">
                                    <FaHeart /> {formatNumber(item.likeCount)}
                                </p>
                                <p className="text-[17px] font-semibold flex items-center gap-2 text-white">
                                    <TbMessageCircleFilled /> {formatNumber(item.commentsCount)}
                                </p>
                            </div>
                            <img
                                src={item.imageUrls[0]}
                                alt={item.caption || "Post image"}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        )}
    </section>
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={explorePagePosts[currentPost]?.user} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} page={page} setPage={setPage} totalPages={totalPages} setTotalPages={setTotalPages} comments={comments} setComments={setComments} />
        {selectedPost !== null && explorePagePosts.length > 1 && <>
            {currentPost !== explorePagePosts.length - 1 && (
                <button
                    className={`fixed z-[100] right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 invisible lg:visible  ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none "
                        }`}
                    onClick={handleIncrease}
                >
                    <FaArrowRight className="fill-black" />
                </button>
            )}

            {currentPost !== 0 && (
                <button
                    className={`fixed z-[100] left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 invisible lg:visible ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none "
                        }`}
                    onClick={handleDecrease}
                >
                    <FaArrowLeft className="fill-black" />
                </button>
            )}
        </>
        }
    </>
}