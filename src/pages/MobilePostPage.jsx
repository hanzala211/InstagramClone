import { useEffect } from "react";
import { HomePost } from "../components/post/HomePost";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { usePost } from "../context/PostContext";


export function MobilePostPage() {
    const { selectedPost, homePosts, setHomePosts } = usePost()
    useEffect(() => {
        setHomePosts([selectedPost])
    }, [])
    return <section className="w-full">
        <PostPageHeader />
        <div className="w-full max-w-[22.8rem] mx-auto mt-12">
            {homePosts.map((item, index) => (
                <HomePost key={index} item={item} index={index} homePosts={homePosts} setHomePosts={setHomePosts} isPost={true} />
            ))}
        </div>
    </section>
}