import { SaveSVG, UnSave } from "../../assets/Constants";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";
import { savePost, unSavePost } from "../../services/post";

export function SavedComponent() {
    const { selectedPost, isSaved, setIsSaved } = usePost()
    const { userData, setUserData, setMessage } = useUser()
    return <>
        {!isSaved ?
            <button onClick={() => savePost(setIsSaved,
                userData,
                setUserData,
                setMessage,
                selectedPost)}>
                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
            </button>
            :
            <button onClick={() => unSavePost(setIsSaved, userData, setUserData, setMessage, selectedPost)}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
        }
    </>
}