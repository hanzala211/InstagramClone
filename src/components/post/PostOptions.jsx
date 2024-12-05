import { CommentSVG } from "../../assets/Constants";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";
import { LikedComponent } from "./LikeComponent";
import { SavedComponent } from "./SavedComponent";

export function PostOptions({ postData, commentRef }) {
    const { userData, setUserData, setMessage } = useUser();
    const { selectedPost, setSelectedPost, isSaved, setIsSaved } = usePost()

    async function savePost() {
        try {
            setIsSaved((prev) => !prev)
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/save/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            if (result.status !== "fail") {
                setUserData((prev) => ({
                    ...prev, data: {
                        ...prev.data, user: {
                            ...prev.data.user, savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0]) ? [...prev.data.user.savedPosts] : [...prev.data.user.savedPosts, ...result.savedPosts]
                        }
                    }
                }))
                setMessage("Post Saved Successfully")
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
            setIsSaved((prev) => !prev)
        }
    }

    async function unSavePost() {
        try {
            setIsSaved((prev) => !prev)
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/unsave/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            if (result.status !== "fail") {
                setUserData((prev) => ({
                    ...prev, data: {
                        ...prev.data, user: {
                            ...prev.data.user, savedPosts: prev.data.user.savedPosts.includes(result.savedPosts[0]) ? prev.data.user.savedPosts.filter((item) => item !== result.savedPosts[0]) : [...prev.data.user.savedPosts, ...result.savedPosts]
                        }
                    }
                }))
                setMessage("Post Unsaved Successfully")
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
            setIsSaved((prev) => !prev)
        }
    }
    return <div className="flex justify-between pt-5 px-5 ">
        <div className="flex flex-row gap-5">
            <LikedComponent postData={postData} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
            <button onClick={() => commentRef.current.focus()}>
                <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
            </button>
        </div>
        <SavedComponent isSaved={isSaved} savePost={savePost} unSavePost={unSavePost} />
    </div>
}