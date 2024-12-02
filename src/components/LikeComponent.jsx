import { useEffect } from "react";
import { Like, UnLike } from "../assets/Constants";
import { useUser } from "../context/UserContext";
import { likePost } from "../utils/helper";
import { usePost } from "../context/PostContext";

export function LikedComponent({ postData, setSelectedPost, selectedPost }) {
    const { userData, setMessage } = useUser()
    const { isLiked, setIsLiked } = usePost()

    useEffect(() => {
        if (selectedPost?.likes) {
            setIsLiked(selectedPost.likes.includes(userData?.data.user._id));
        }
    }, [selectedPost, postData?._id])


    async function unLikePost() {
        try {
            setSelectedPost((prev) => {
                const hasLiked = prev.likes.some((item) => item === userData.data.user._id);
                return {
                    ...prev,
                    likeCount: hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
                    likes: hasLiked
                        ? prev.likes.filter((item) => item !== userData.data.user._id) // Remove like
                        : [...prev.likes, userData.data.user._id], // Add like
                };
            });
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/dislike/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            if (result.message !== "Post disliked successfully.") {
                setIsLiked((prev) => !prev)
            } else {
                setMessage(result.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return <>
        {!isLiked ?
            <button onClick={() => likePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer`} /></button>
            : <button onClick={() => unLikePost()}><UnLike className={`hover:opacity-80 fill-red-700 transition-all duration-150 cursor-pointer`} /></button>}</>
} 