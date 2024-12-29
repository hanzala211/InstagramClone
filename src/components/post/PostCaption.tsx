import { Post, PostUserData } from "../../types/postType"
import { UserInfo } from "../../types/user"

interface PostCaptionProps{
    postData: PostUserData | UserInfo;
    isImg: boolean;
    selectedPost: Post;
}

export const PostCaption: React.FC<PostCaptionProps> = ({ postData, isImg, selectedPost }) => {

    return <>
        {selectedPost !== null && selectedPost?.caption && (
            <div>
                <div className={`w-full ${!isImg ? "px-2 mt-1" : "px-6 mt-3"} text-[14px]`}>
                    <div className="flex flex-row gap-4 items-center">
                        {isImg && <img src={postData?.profilePic} alt="Profile Picture" className="w-9 rounded-full" />}
                        <p className="text-[#a8a8a1]">
                            <span className="font-semibold mr-3 cursor-default">{postData?.userName}</span>
                            {selectedPost?.caption}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </>
}