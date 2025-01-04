import { Like, SaveSVG, ShareIcon, UnLike, UnSave } from "../../assets/Constants"
import { useHome } from "../../context/HomeContext"
import { usePost } from "../../context/PostContext"
import { useUser } from "../../context/UserContext"
import { likePost, savePost, unLikePost, unSavePost } from "../../services/homePage"
import { CommentHome } from "../comments/CommentHome"
import { CommentDrawerOpener } from "./CommentDrawerOpener"

interface HomePostOptionsProps {
    likedPosts: boolean[];
    index: number;
    item: any;
    setLikedPosts: (value: boolean[]) => void;
    savedPosts: boolean[];
    setCurrentPost: (value: any) => void;
    setSavedPosts: (value: boolean[]) => void;
    setIsPostOpen: (value: boolean) => void
}

export const HomePostOptions: React.FC<HomePostOptionsProps> = ({ likedPosts, index, item, setLikedPosts, savedPosts, setCurrentPost, setSavedPosts, setIsPostOpen }) => {
    const { userData, setUserData, setMessage, innerWidth } = useUser()
    const { setSelectedPost, setIsShareOpenHome } = usePost()
    const { setHomePosts } = useHome()

    return <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
            {!likedPosts[index] ?
                <button onClick={() => likePost(item._id, index, setLikedPosts, setHomePosts, userData, setMessage)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer mb-1`} /></button>
                : <button onClick={() => unLikePost(item._id, index, setLikedPosts,
                    setHomePosts,
                    userData,
                    setMessage)}><UnLike className={`hover:opacity-80 fill-red-700 mb-1 transition-all duration-150 cursor-pointer`} /></button>}
            {innerWidth >= 770 && <span onClick={() => setSelectedPost(item)}><CommentHome setIsPostOpen={setIsPostOpen} setCurrentPost={setCurrentPost} i={index} /></span>}

            <CommentDrawerOpener item={item} setCurrentPost={setCurrentPost} index={index} isText={false} />

            <button onClick={() => {
                setSelectedPost(item)
                setIsShareOpenHome((prev) => {
                    const updated = [...prev]
                    updated[index] = true;
                    return updated;
                })
            }} className="hover:opacity-70 transition duration-300 mb-0.5"><ShareIcon /></button>
        </div>
        {!savedPosts[index] ?
            <button onClick={() => savePost(item._id, index, setSavedPosts, setUserData, userData, setMessage)}>
                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
            </button> : <button onClick={() => unSavePost(item._id, index, setSavedPosts, userData, setUserData, setMessage)}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
        }
    </div>
}