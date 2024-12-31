import { useEffect } from "react";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";
import { postComment } from "../../services/post";
import { Post } from "../../types/postType";

interface PostCommentProps {
    commentRef?: any;
    className?: string;
    item: Post | null;
}

export const PostComment: React.FC<PostCommentProps> = ({ commentRef, className, item }) => {
    const { setIsDisabled, isDisabled, commentValue, setCommentValue, setIsCommented, selectedPost, setSelectedPost } = usePost()
    const { userData, setMessage } = useUser()

    useEffect(() => {
        if (commentValue.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true);
        }
    }, [commentValue])

    return <div className={`mt-5 border-t-[1px] flex items-center border-[#262626] px-3 py-2 ${className}`}>
        <input
            ref={commentRef}
            type="text"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder="Add a comment...."
            className="w-[90%] bg-transparent outline-none placeholder:text-[14px]"
            onFocus={() => {
                if (selectedPost === null) {
                    setSelectedPost(item)
                }
            }}
        />
        <button
            className={`text-[#0095F6] ml-5 text-[12px] transition-all duration-150 ${isDisabled ? "opacity-50 " : "cursor-pointer hover:opacity-70"}`}
            disabled={isDisabled}
            onClick={() => postComment(setIsDisabled, userData, commentValue, selectedPost, setMessage, setCommentValue, setIsCommented)}
        >
            POST
        </button>
    </div>
}