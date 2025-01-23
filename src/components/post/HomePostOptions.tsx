import { Like, SaveSVG, ShareIcon, UnLike, UnSave } from "../../assets/Constants"
import { useAuth } from "../../context/AuthContext"
import { useHome } from "../../context/HomeContext"
import { usePost } from "../../context/PostContext"
import { useUser } from "../../context/UserContext"
import { homePostSave, homePostUnsave } from "../../services/homePage"
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
    const { setMessage, innerWidth } = useUser()
    const { userData, setUserData, token } = useAuth()
    const { setSelectedPost, setIsShareOpenHome } = usePost()
    const { setHomePosts, likeHomePost, disLikeHomePost } = useHome()

    const savePost = async () => {
        try {
            setSavedPosts((prev: any) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });
            const res = await homePostSave({
                token,
                id: item._id
            })
            if (res.status !== 'fail') {
                setUserData((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        user: {
                            ...prev.data.user,
                            savedPosts: res.savedPosts.includes(item._id)
                                ? [...prev.data.user.savedPosts, item._id]
                                : [...prev.data.user.savedPosts],
                        },
                    },
                }));
                setMessage('Post Saved Successfully');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const unSavePost = async () => {
        try {
            setSavedPosts((prev: any) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
            const res = await homePostUnsave({
                token,
                id: item._id
            })
            if (res.status !== 'fail') {
                setUserData((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        user: {
                            ...prev.data.user,
                            savedPosts: prev.data.user.savedPosts.filter(
                                (postId: string) => postId !== item._id
                            ),
                        },
                    },
                }));
                setMessage('Post Unsaved Successfully');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-3">
            {!likedPosts[index] ?
                <button onClick={() => likeHomePost(item._id, index)}><Like className={`hover:opacity-80 transition-all duration-150 cursor-pointer mb-1`} /></button>
                : <button onClick={() => disLikeHomePost(item._id, index)}><UnLike className={`hover:opacity-80 fill-red-700 mb-1 transition-all duration-150 cursor-pointer`} /></button>}
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
            <button onClick={savePost}>
                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
            </button> : <button onClick={unSavePost}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
        }
    </div>
}