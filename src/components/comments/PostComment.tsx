import { useEffect } from "react";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";
import { Post } from "../../types/postType";
import { useAuth } from "../../context/AuthContext";
import { commentPost } from "../../services/post";

interface PostCommentProps {
    commentRef?: any;
    className?: string;
    item?: Post | null;
}

export const PostComment: React.FC<PostCommentProps> = ({ commentRef, className, item }) => {
    const { setIsDisabled, isDisabled, commentValue, setCommentValue, setIsCommented, selectedPost, setSelectedPost } = usePost()
    const { setMessage } = useUser()
    const { userData, token } = useAuth()

    useEffect(() => {
        if (commentValue.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true);
        }
    }, [commentValue])

    const postComment = async () => {
        try {
            setIsDisabled(true);
            const res = await commentPost({
                token,
                selectedPost,
                raw: {
                    comment: commentValue
                }
            })
            if (res.status !== 'fail') {
                setMessage('Commented Successfully');
                setCommentValue('');
                setIsCommented((prev: boolean) => !prev);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed');
        } finally {
            setIsDisabled(commentValue.length === 0);
        }
    }

    return <div className={`mt-5 border-t-[1px] flex items-center border-[#262626] px-3 py-2 ${className}`}>
        <input
            ref={commentRef}
            type="text"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder="Add a comment...."
            className="w-[90%] bg-transparent outline-none placeholder:text-[14px]"
            onFocus={() => {
                if (selectedPost === null && item !== undefined) {
                    setSelectedPost(item)
                }
            }}
        />
        <button
            className={`text-[#0095F6] ml-5 text-[12px] transition-all duration-150 ${isDisabled ? "opacity-50 " : "cursor-pointer hover:opacity-70"}`}
            disabled={isDisabled}
            onClick={postComment}
        >
            POST
        </button>
    </div>
}