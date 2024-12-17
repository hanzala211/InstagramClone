import { useState } from "react";
import { CommentSVG, ShareIcon } from "../../assets/Constants";
import { usePost } from "../../context/PostContext";
import { CommentDrawerOpener } from "./CommentDrawerOpener";
import { LikedComponent } from "./LikeComponent";
import { SavedComponent } from "./SavedComponent";

export function PostOptions({ postData, commentRef }) {
    const { selectedPost, setSelectedPost, setIsShareOpen } = usePost()
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [isPostOpen, setIsPostOpen] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)

    return <div className="flex justify-between pt-5 px-2">
        <div className="flex flex-row gap-5">
            <LikedComponent postData={postData} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
            <button className="md:block hidden" onClick={() => commentRef.current.focus()}>
                <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
            </button>
            <CommentDrawerOpener item={selectedPost} setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} index={0} setCurrentPostIndex={setCurrentPostIndex} />
            <button onClick={() => setIsShareOpen(true)} className="hover:opacity-70 transition duration-300 mt-0.5"><ShareIcon /></button>
        </div>
        <SavedComponent />
    </div>
}