import { SaveSVG, UnSave } from "../../assets/Constants";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";
import { postSave, postUnsave } from "../../services/post";

export const SavedComponent = () => {
    const { selectedPost, isSaved, setIsSaved } = usePost()
    const { setMessage } = useUser()
    const { userData, setUserData, token } = useAuth()

    const savePost = async () => {
        try {
            const res = await postSave({
                token,
                selectedPost
            })
            if (res.status !== 'fail') {
                setUserData((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        user: {
                            ...prev.data.user,
                            savedPosts: prev.data.user.savedPosts.includes(res.savedPosts[0])
                                ? [...prev.data.user.savedPosts]
                                : [...prev.data.user.savedPosts, ...res.savedPosts],
                        },
                    },
                }));
                setMessage('Post Saved Successfully');
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed');
            setIsSaved((prev: any) => !prev);
        }
    }

    const unSavePost = async () => {
        try {
            const res = await postUnsave({
                token,
                selectedPost
            })
            if (res.status !== 'fail') {
                setUserData((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        user: {
                            ...prev.data.user,
                            savedPosts: prev.data.user.savedPosts.includes(res.savedPosts[0])
                                ? prev.data.user.savedPosts.filter(
                                    (item: any) => item !== res.savedPosts[0]
                                )
                                : [...prev.data.user.savedPosts, ...res.savedPosts],
                        },
                    },
                }));
                setMessage('Post Unsaved Successfully');
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed');
            setIsSaved((prev: any) => !prev);
        }
    }

    return <>
        {!isSaved ?
            <button onClick={savePost}>
                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
            </button>
            :
            <button onClick={unSavePost}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
        }
    </>
}