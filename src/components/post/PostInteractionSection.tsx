import { usePost } from "../../context/PostContext"
import { formatDate } from "../../utils/helper"
import { PostComment } from "../comments/PostComment"
import { PostCaption } from "./PostCaption"
import { PostOptions } from "./PostOptions"

interface PostInteractionSectionProps {
    postData: any;
    commentRef: any;
    isCaption: boolean;
}

export const PostInteractionSection: React.FC<PostInteractionSectionProps> = ({ postData, commentRef, isCaption }) => {
    const { selectedPost } = usePost()

    return <>
        <PostOptions postData={postData} commentRef={commentRef} />
        <div>
            {selectedPost !== null && (
                <div className="mt-2 px-2">
                    <p className="text-[15px] font-semibold">{selectedPost.likeCount} likes</p>
                    <p className="text-[12px] text-[#a8a8a8]">{formatDate(selectedPost.createdAt)} ago</p>
                </div>
            )}
        </div>
        {isCaption &&
            <PostCaption selectedPost={selectedPost} postData={postData} isImg={false} />
        }
        <PostComment commentRef={commentRef} />
    </>
}