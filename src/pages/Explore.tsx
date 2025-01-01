import { useEffect, useRef, useState } from "react"
import { useUser } from "../context/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/helpers/Loader";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Post } from "../components/post/Post";
import { usePost } from "../context/PostContext";
import { PostModal } from "../components/post/PostModal";
import { UserModal } from "../components/usermodals/UserModal";
import { fetchSearch } from "../services/search";
import { fetchExplorePosts } from "../services/post";
import { useSearch } from "../context/SearchContext";
import { useHome } from "../context/HomeContext";
import { Post as PostData } from "../types/postType";
import { ShadCnSkeleton } from "../components/ui/shadcnSkeleton";

export function Explore() {
    const { userData } = useUser();
    const { searchQuery, setSearchQuery, searchData, setSearchData, setSelectedProfile } = useSearch();
    const { setSelectedPost, selectedPost, setComments } = usePost()
    const { setPage, setTotalPages } = useHome()
    const [explorePagePosts, setExplorePagePosts] = useState<PostData[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState<boolean>(true);
    const [currentPost, setCurrentPost] = useState<number | any>(null);
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsPostsLoading(true)
        fetchExplorePosts(setCount, setExplorePagePosts, userData, setHasMore, setIsPostsLoading);
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
            fetchSearch(signal, setSearchData, searchQuery, userData, setSearchLoading);
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
        setCurrentIndex(0)
        setComments([])
        setPage(1);
        setTotalPages(0)
    }

    function handleDecrease() {
        setCurrentPost((prev: any) => prev - 1)
        setCurrentIndex(0)
        setComments([])
        setPage(1);
        setTotalPages(0)
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
                    <ShadCnSkeleton key={i} className="w-full xl:h-[20rem] lg:h-[17rem] sm:h-[12rem] md:h-[15rem] h-[8rem] rounded-md max-w-full bg-[#262626] " />
                ))}
            </div> : (
                <InfiniteScroll dataLength={explorePagePosts.length} next={() => {
                    fetchExplorePosts(setCount, setExplorePagePosts, userData, setHasMore, setIsPostsLoading)
                }} loader={
                    <div className="flex justify-center items-end py-4">
                        <Loader height={`${explorePagePosts.length > 10 ? "h-[15vh] mb-5" : "md:h-[30vh] h-[60vh]"} `} />
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
        <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={explorePagePosts[currentPost]?.user} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} />

        {selectedPost !== null && explorePagePosts.length > 1 && <>
            {currentPost !== explorePagePosts.length - 1 && (
                <button
                    className={`fixed z-[100] right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 invisible xl:visible  ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none "
                        }`}
                    onClick={handleIncrease}
                >
                    <FaArrowRight className="fill-black" />
                </button>
            )}

            {currentPost !== 0 && (
                <button
                    className={`fixed z-[100] left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 invisible xl:visible ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none "
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