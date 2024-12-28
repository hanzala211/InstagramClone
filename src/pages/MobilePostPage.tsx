import { useEffect, useState } from "react";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { usePost } from "../context/PostContext";
import { Post } from "../components/post/Post";
import { useLocation } from "react-router-dom";
import { fetchPost } from "../services/post";
import { useUser } from "../context/UserContext";
import { Loader } from "../components/helpers/Loader";
import { useHome } from "../context/HomeContext";


export const MobilePostPage: React.FC = () => {
    const { selectedPost, setSelectedPost } = usePost()
    const { page, setPage, totalPages, setTotalPages } = useHome()
    const { userData } = useUser()
    const [currentPostIndex, setCurrentPostIndex] = useState<number>(0)
    const [isPostOpen, setIsPostOpen] = useState<boolean>(true)
    const [currentPost, setCurrentPost] = useState<number>(0)
    const [isPostLoading, setIsPostLoading] = useState<boolean>(false)
    const location = useLocation()


    useEffect(() => {
        if (selectedPost === null) {
            setIsPostLoading(true)
            fetchPost(location.pathname.split('/p/')[1].split('/')[0], userData, setSelectedPost, setIsPostLoading)
        }
    }, [selectedPost])

    return <section className="w-full min-h-screen">
        <PostPageHeader isArrowNeeded={true} />
        {!isPostLoading ?
            <div className="w-full 440:max-w-[27rem] h-[100vh] max-w-[25rem] md:max-w-[60rem] mx-auto mt-14">
                <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={selectedPost?.postBy ? (typeof selectedPost?.postBy === "object" && selectedPost?.postBy !== null) ? selectedPost?.postBy : selectedPost?.user : selectedPost?.user} page={page} setPage={setPage} currentIndex={currentPostIndex} setCurrentIndex={setCurrentPostIndex} currentPost={currentPost} setCurrentPost={setCurrentPost} totalPages={totalPages} setTotalPages={setTotalPages} isMobile={true} />
            </div> : <div><Loader height="h-[30vh]" widthHeight={true} /></div>}
    </section>
}