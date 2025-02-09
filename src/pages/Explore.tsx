import { useEffect, useRef, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/helpers/Loader";
import { Post } from "../components/post/Post";
import { usePost } from "../context/PostContext";
import { PostModal } from "../components/post/PostModal";
import { UserModal } from "../components/usermodals/UserModal";
import { useSearch } from "../context/SearchContext";
import { useHome } from "../context/HomeContext";
import { ShadCnSkeleton } from "../components/ui/shadcnSkeleton";
import { PostSliderButtons } from "../components/post/PostSliderButtons";
import { useAuth } from "../context/AuthContext";
import { getExplorePosts } from "../services/post";

export function Explore() {
    const { searchQuery, setSearchQuery, searchData, setSearchData, explorePagePosts, setExplorePagePosts, setSearchLoading, fetchSearch } = useSearch();
    const { setSelectedProfile, token } = useAuth();
    const { setSelectedPost, setComments, setPage, setTotalPages } = usePost()
    const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);
    const [currentPost, setCurrentPost] = useState<number | any>(null);
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (explorePagePosts.length === 0) {
            setIsPostsLoading(true)
            fetchExplorePosts();
        }
    }, [])

    useEffect(() => {
        if (currentPost !== null && currentPost < explorePagePosts.length) {
            setSelectedPost(explorePagePosts[currentPost])
        }
    }, [currentPost])

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (searchQuery.length > 0) {
            setSearchLoading(true);
            fetchSearch(signal, searchQuery, token);
        } else if (searchQuery.length === 0) {
            setSearchLoading(false)
            setSearchData([]);
        }
        return () => abortController.abort();
    }, [searchQuery])

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleOutsideClick = (e: any) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
            setIsSearching(false);
        }
    };

    function handleIncrease() {
        setCurrentPost((prev: any) => prev + 1)
        setComments([])
        setPage(1);
        setTotalPages(0)
    }

    function handleDecrease() {
        setCurrentPost((prev: any) => prev - 1)
        setComments([])
        setPage(1);
        setTotalPages(0)
    }

    async function fetchExplorePosts() {
        try {
            setCount((prev: number) => prev + 1);
            const res = await getExplorePosts({
                token
            })
            if (res.status !== 'fail') {
                setExplorePagePosts((prev: any) => {
                    const newItems = res.data.filter(
                        (item: any) => !prev.some((prevItem: any) => prevItem._id === item._id)
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

    return <>
        <section className={`w-full lg:max-w-[80%] xl:max-w-[60%] sm:max-w-[95%] max-w-[97%] mt-7 mx-auto `}>
            <div ref={containerRef} className="bg-[#121212] w-full md:hidden flex sm:gap-10 gap-3 items-center p-3 h-[3.5rem] fixed top-0 z-[50] left-0">
                <input ref={inputRef} type="text" name="search" id="search" placeholder="Search" className={`bg-[#000] border-[1px] border-[#6F6F6F] rounded-md py-1 px-3 outline-none ${isSearching ? "w-[85%]" : "w-full"}`} onFocus={() => setIsSearching(true)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {isSearching && <button className="text-[14px]" onClick={() => setIsSearching(false)}>Cancel</button>}
            </div>

            <div className={`w-full flex md:hidden mt-5 flex-col gap-1 bg-[#000] ${isSearching ? "h-[100vh]" : ""}`}>
                {searchData?.map((item, i) => (
                    <UserModal key={i} item={item} setSelectedProfile={setSelectedProfile} isSearchModal={true} />
                ))}
            </div>

            {explorePagePosts.length === 0 && !isPostsLoading ? (
                <p className="text-center text-lg text-gray-500">
                    No posts available. Check back later!
                </p>
            ) : isPostsLoading ? <div className="grid grid-flow-row grid-cols-3 gap-1 mt-5 mb-20 md:mb-0 md:mt-0">
                {Array.from({ length: 24 }, (item, i) => (
                    <ShadCnSkeleton key={i} className="w-full xl:h-[15rem] 1280:h-[20rem] lg:h-[17rem] sm:h-[12rem] md:h-[15rem] h-[8rem] rounded-md max-w-full bg-[#262626] " />
                ))}
            </div>
                : (
                    <InfiniteScroll dataLength={explorePagePosts.length} next={fetchExplorePosts} loader={
                        <div className="flex justify-center items-end py-4">
                            <Loader height={`${explorePagePosts.length > 10 ? "h-[15vh] mb-5" : "md:h-[60vh] h-[60vh]"} `} />
                        </div>}
                        hasMore={count < 8 && hasMore}>
                        <div className={`grid grid-flow-row grid-cols-3 gap-1 mt-5 mb-20 md:mb-0 md:mt-0`}>
                            {explorePagePosts.map((item, index, arr) => (
                                <PostModal key={index} arr={arr} setSelectedPost={setSelectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} item={item} i={index} />
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
        </section>

        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={explorePagePosts[currentPost]?.user} currentPost={currentPost} setCurrentPost={setCurrentPost} />

        <PostSliderButtons posts={explorePagePosts} handleDecrease={handleDecrease} handleIncrease={handleIncrease} currentPost={currentPost} isPostSlider={false} />
    </>
}