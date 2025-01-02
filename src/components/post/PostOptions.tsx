import { useState } from "react";
import { CommentSVG, ShareIcon } from "../../assets/Constants";
import { usePost } from "../../context/PostContext";
import { CommentDrawerOpener } from "./CommentDrawerOpener";
import { LikedComponent } from "./LikeComponent";
import { SavedComponent } from "./SavedComponent";
import { PostUserData } from "../../types/postType";
import { UserInfo } from "../../types/user";

interface PostOptionsProps {
    postData: PostUserData | UserInfo;
    commentRef: any;
}

export const PostOptions: React.FC<PostOptionsProps> = ({ postData, commentRef }) => {
    const { selectedPost, setIsShareOpen } = usePost()
    const [currentPostIndex, setCurrentPostIndex] = useState<number>(0)
    const [currentPost, setCurrentPost] = useState<number>(0)

    return <div className="flex justify-between pt-5 px-3">
        <div className="flex flex-row gap-5">
            <LikedComponent postData={postData} />
            <button className="md:block hidden" onClick={() => commentRef.current.focus()}>
                <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
            </button>
            <CommentDrawerOpener item={selectedPost} setCurrentPost={setCurrentPost} index={0} setCurrentPostIndex={setCurrentPostIndex} />
            <button onClick={() => setIsShareOpen(true)} className="hover:opacity-70 mt-0.5 transition duration-300"><ShareIcon /></button>
        </div>
        <SavedComponent />
    </div>
}