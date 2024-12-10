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
    return <section className="w-full min-h-screen">
        <PostPageHeader isArrowNeeded={true} />
        <div className="w-full 440:max-w-[24rem] max-w-[22rem] mx-auto mt-12">
            {homePosts.map((item, index) => (
                <HomePost key={index} item={item} index={index} homePosts={homePosts} setHomePosts={setHomePosts} isPost={true} />
            ))}
        </div>
        <PostComment className="fixed w-full bottom-[3.5rem]" commentRef={commentRef} />
    </section>
}