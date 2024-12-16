import { useEffect } from "react";
import { Like, UnLike } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";
import { usePost } from "../../context/PostContext";
import { likePost, unLikePost } from "../../services/post";

export function LikedComponent({ postData, setSelectedPost, selectedPost }) {
    const { userData, setMessage } = useUser()
    const { isLiked, setIsLiked } = usePost()

    useEffect(() => {
        if (selectedPost?.likes) {
            setIsLiked(selectedPost.likes.includes(userData?.data.user._id));
        }
    }, [selectedPost, postData?._id])

    return <>
        {!isLiked ?
            <button onClick={() => likePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer`} /></button>
            : <button onClick={() => unLikePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage)}><UnLike className={`hover:opacity-80 fill-red-700 transition-all duration-150 cursor-pointer`} /></button>}</>
} 