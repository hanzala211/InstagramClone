import { useState } from "react";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { usePost } from "../context/PostContext";
import { Post } from "../components/post/Post";


export function MobilePostPage() {
    const { comments, setComments, page, setPage, totalPages, setTotalPages, selectedPost } = usePost()
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [isPostOpen, setIsPostOpen] = useState(true)
    const [currentPost, setCurrentPost] = useState(null)

    return <section className="w-full min-h-screen">
        <PostPageHeader isArrowNeeded={true} />
        <div className="w-full 440:max-w-[27rem] h-[100vh] max-w-[25rem] md:max-w-[60rem] mx-auto mt-12">
            <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={selectedPost?.postBy ? (typeof selectedPost?.postBy === "object" && selectedPost?.postBy !== null) ? selectedPost?.postBy : selectedPost?.user : selectedPost?.user} page={page} setPage={setPage} currentIndex={currentPostIndex} setCurrentIndex={setCurrentPostIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} totalPages={totalPages} setTotalPages={setTotalPages} comments={comments} setComments={setComments} isMobile={true} />
        </div>
    </section>
}