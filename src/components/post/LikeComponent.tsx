import { useEffect } from "react";
import { Like, UnLike } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";
import { usePost } from "../../context/PostContext";
import { PostUserData } from "../../types/postType";
import { UserInfo } from "../../types/user";
import { useAuth } from "../../context/AuthContext";

interface LikedComponentProps {
    postData: PostUserData | UserInfo;
}

export const LikedComponent: React.FC<LikedComponentProps> = ({ postData }) => {
    const { setMessage } = useUser()
    const { userData } = useAuth()
    const { isLiked, setIsLiked, setSelectedPost, selectedPost, likePost, disLikePost } = usePost()

    useEffect(() => {
        if (selectedPost?.likes) {
            setIsLiked(selectedPost.likes.includes(userData?.data.user._id));
        }
    }, [selectedPost, postData?._id])

    return <>
        {!isLiked ?
            <button onClick={likePost}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer`} /></button>
            : <button onClick={disLikePost}><UnLike className={`hover:opacity-80 fill-red-700 transition-all duration-150 cursor-pointer`} /></button>}</>
} 