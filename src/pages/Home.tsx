import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../components/helpers/Loader";
import { RiUserFollowFill } from "react-icons/ri";
import { Post } from "../components/post/Post";
import { getHomePosts, getHomeStories } from "../services/homePage";
import { PageHeader } from "../components/sidebar/PageHeader";
import { useHome } from "../context/HomeContext";
import { HomePost } from "../components/post/HomePost"
import { HomePostSkeleton } from "../components/helpers/HomePostSkeleton";
import { useAuth } from "../context/AuthContext";
import { HomeStories } from "../components/story/HomeStories";

export const Home: React.FC = () => {
    const { homeStories, setHomeStories, homePosts, setHomePosts } = useHome();
    const { userData, token } = useAuth();
    const [isPostsLoading, setIsPostsLoading] = useState<boolean>(false);
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
    const [currentPost, setCurrentPost] = useState<number | any>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        if (homePosts.length === 0) {
            setIsPostsLoading(true);
            fetchHomePosts();
            fetchHomeStories();
        }
    }, [userData, setHomePosts, setIsPostsLoading, setHasMore, setHomeStories]);

    const fetchNextPosts = () => {
        if (!isPostsLoading) {
            fetchHomePosts();
        }
    }

    async function fetchHomePosts() {
        try {
            const res = await getHomePosts({
                token
            })

            if (res.status !== 'fail') {
                setHomePosts((prev) => {
                    const newItems = res.data.filter(
                        (item: any) => !prev.some((prevItem) => prevItem._id === item._id)
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

    async function fetchHomeStories() {
        try {
            const res = await getHomeStories({
                token
            })

            setHomeStories(
                res.stories.filter((item: any) => item.user.stories.length > 0)
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <PageHeader isArrowNeeded={false} isHomePage={true} />
            {homeStories.length > 0 && <HomeStories />}
            <section className={`w-full lg:max-w-[40%] sm:max-w-[85%] max-w-[95%] mb-20 md:mb-2 mx-auto ${homeStories.length === 0 ? "mt-16 md:mt-10" : "mt-5"
                }`}>
                <div className={`flex flex-col gap-2 w-full`}>
                    {!isPostsLoading ? (
                        <InfiniteScroll
                            dataLength={homePosts.length}
                            loader={homePosts.length > 0 && <Loader height="md:h-[10vh] h-[15vh] overflow-scroll scrollbar-hidden" />}
                            next={fetchNextPosts}
                            hasMore={hasMore}
                        >
                            {homePosts.length > 0
                                ? homePosts.map((post, index) => (
                                    <HomePost
                                        key={index}
                                        index={index}
                                        item={post}
                                        setHomePosts={setHomePosts}
                                        setCurrentPost={setCurrentPost}
                                        setIsPostOpen={setIsPostOpen}
                                    />
                                ))
                                : ""}
                        </InfiniteScroll>
                    ) : <div className="flex gap-10 flex-col">
                        {Array.from({ length: 6 }, (_, i) => (
                            <HomePostSkeleton key={i} />
                        ))}
                    </div>
                    }
                    {homePosts.length === 0 && !isPostsLoading && (
                        <div className="absolute top-20 left-[50%] -translate-x-1/2 text-center flex flex-col items-center gap-1">
                            <RiUserFollowFill className="text-[40px]" />
                            <h2 className="text-[40px] font-semibold">Follow Someone</h2>
                        </div>
                    )}
                </div>
            </section>
            <Post
                isPostOpen={isPostOpen}
                setIsPostOpen={setIsPostOpen}
                postData={homePosts[currentPost]?.user}
                currentPost={currentPost}
                setCurrentPost={setCurrentPost}
            />
        </>
    );
}
