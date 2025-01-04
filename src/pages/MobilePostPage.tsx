import { useEffect, useState } from "react";
import { PageHeader } from "../components/sidebar/PageHeader";
import { usePost } from "../context/PostContext";
import { Post } from "../components/post/Post";
import { useLocation } from "react-router-dom";
import { fetchPost } from "../services/post";
import { useUser } from "../context/UserContext";
import { Loader } from "../components/helpers/Loader";
import { useHome } from "../context/HomeContext";
import { HomePostSkeleton } from "../components/helpers/HomePostSkeleton";


export const MobilePostPage: React.FC = () => {
    const { selectedPost, setSelectedPost } = usePost()
    const { userData } = useUser()
    const [isPostOpen, setIsPostOpen] = useState<boolean>(true)
    const [currentPost, setCurrentPost] = useState<number | any>(0)
    const [isPostLoading, setIsPostLoading] = useState<boolean>(false)
    const location = useLocation()


    useEffect(() => {
        if (selectedPost === null) {
            setIsPostLoading(true)
            fetchPost(location.pathname.split('/p/')[1].split('/')[0], userData, setSelectedPost, setIsPostLoading)
        }
    }, [selectedPost])

    return <section className="w-full min-h-screen">
        <PageHeader isArrowNeeded={true} />
        {!isPostLoading ?
            <div className="w-full 440:max-w-[27rem] h-[100vh] max-w-[25rem] md:max-w-[60rem] mx-auto mt-14">
                <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={selectedPost?.postBy ? (typeof selectedPost?.postBy === "object" && selectedPost?.postBy !== null) ? selectedPost?.postBy : selectedPost?.user : selectedPost?.user} currentPost={currentPost} setCurrentPost={setCurrentPost} isMobile={true} />
            </div> : <div className="mt-16 mx-2"><HomePostSkeleton /></div>}
    </section>
}