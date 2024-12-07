import { useEffect, useRef } from "react";
import { HomePost } from "../components/post/HomePost";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { usePost } from "../context/PostContext";
import { PostComment } from "../components/comments/PostComment";


export function MobilePostPage() {
    const { selectedPost, homePosts, setHomePosts } = usePost()
    const commentRef = useRef(null)
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
        <PostComment className="fixed w-full bottom-[3.4rem]" commentRef={commentRef} />
    </section>
}