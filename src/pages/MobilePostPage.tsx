import { useEffect, useState } from "react";
import { PageHeader } from "../components/sidebar/PageHeader";
import { usePost } from "../context/PostContext";
import { Post } from "../components/post/Post";
import { useLocation } from "react-router-dom";
import { HomePostSkeleton } from "../components/helpers/HomePostSkeleton";
import { useAuth } from "../context/AuthContext";
import { getPost } from "../services/searchProfile";


export const MobilePostPage: React.FC = () => {
    const { selectedPost, setSelectedPost } = usePost()
    const { token } = useAuth()
    const [isPostOpen, setIsPostOpen] = useState<boolean>(true)
    const [currentPost, setCurrentPost] = useState<number | any>(0)
    const [isPostLoading, setIsPostLoading] = useState<boolean>(false)
    const location = useLocation()


    useEffect(() => {
        if (selectedPost === null) {
            setIsPostLoading(true)
            fetchPost()
        }
    }, [selectedPost])

    async function fetchPost() {
        try {
            const res = await getPost({
                postID: location.pathname.split('/p/')[1].split('/')[0],
                token
            });
            setSelectedPost(res.post);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPostLoading(false);
        }
    }

    return <section className="w-full min-h-screen">
        <PageHeader isArrowNeeded={true} />
        {!isPostLoading ?
            <div className="w-full 440:max-w-[27rem] h-[100vh] max-w-[25rem] md:max-w-[60rem] mx-auto mt-14">
                <Post isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} postData={selectedPost?.postBy ? (typeof selectedPost?.postBy === "object" && selectedPost?.postBy !== null) ? selectedPost?.postBy : selectedPost?.user : selectedPost?.user} currentPost={currentPost} setCurrentPost={setCurrentPost} isMobile={true} />
            </div> : <div className="mt-16 mx-2"><HomePostSkeleton /></div>}
    </section>
}