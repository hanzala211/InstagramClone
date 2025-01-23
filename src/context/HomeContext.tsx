import { createContext, useContext, useState } from "react";
import { ContextChild, HomeContextType } from "../types/contextTypes";
import { Post } from "../types/postType";
import { HomeStories } from "../types/stories";
import { useAuth } from "./AuthContext";
import { homePostLike } from "../services/homePage";
import { useUser } from "./UserContext";

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const HomeProvider: React.FC<ContextChild> = ({ children }) => {
    const { token, userData } = useAuth()
    const { setMessage } = useUser()
    const [homeStories, setHomeStories] = useState<HomeStories[]>([])
    const [homePosts, setHomePosts] = useState<Post[]>([])
    const [savedPosts, setSavedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [likedPosts, setLikedPosts] = useState<boolean[]>(Array(homePosts.length).fill(false))
    const [isHovered, setIsHovered] = useState<boolean[]>(Array(homePosts.length).fill(false))

    const likeHomePost = async (id: string, index: number) => {
        try {
            setLikedPosts((prev: any) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });

            setHomePosts((prev) => {
                const updatedPosts = [...prev];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    likeCount: updatedPosts[index].likeCount + 1,
                    likes: updatedPosts[index].likes.includes(userData?.data.user._id)
                        ? updatedPosts[index].likes
                        : [...updatedPosts[index].likes, userData.data.user._id],
                };
                return updatedPosts;
            });
            const res = await homePostLike({
                token,
                id
            })
            if (res.message !== 'Post liked successfully.') {
                setLikedPosts((prev) => {
                    const updated = [...prev];
                    updated[index] = false;
                    return updated;
                });
                setHomePosts((prev) => {
                    const updatedPosts = [...prev];
                    updatedPosts[index] = {
                        ...updatedPosts[index],
                        likeCount: updatedPosts[index].likeCount - 1,
                        likes: updatedPosts[index].likes.includes(userData.data.user._id)
                            ? updatedPosts[index].likes
                            : [...updatedPosts[index].likes, userData.data.user._id],
                    };
                    return updatedPosts;
                });
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const disLikeHomePost = async (id: string, index: number) => {
        try {
            setLikedPosts((prev) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });

            setHomePosts((prev) => {
                const updatedPosts = [...prev];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    likeCount: updatedPosts[index].likeCount - 1,
                    likes: updatedPosts[index].likes.filter(
                        (userId) => userId !== userData.data.user._id
                    ),
                };
                return updatedPosts;
            });

            const res = await homePostLike({
                token,
                id
            })
            if (res.message !== 'Post disliked successfully.') {
                setLikedPosts((prev) => {
                    const updated = [...prev];
                    updated[index] = false;
                    return updated;
                });
                setHomePosts((prev) => {
                    const updatedPosts = [...prev];
                    updatedPosts[index] = {
                        ...updatedPosts[index],
                        likeCount: updatedPosts[index].likeCount + 1,
                        likes: updatedPosts[index].likes.includes(userData.data.user._id)
                            ? updatedPosts[index].likes
                            : [...updatedPosts[index].likes, userData.data.user._id],
                    };
                    return updatedPosts;
                });
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    }


    return <HomeContext.Provider value={{ homeStories, setHomeStories, homePosts, setHomePosts, savedPosts, setSavedPosts, likedPosts, setLikedPosts, isHovered, setIsHovered, likeHomePost, disLikeHomePost }}>{children}</HomeContext.Provider>
}

export const useHome = (): HomeContextType => {
    const context = useContext(HomeContext)
    if (!context) {
        throw new Error("use useHome in Home Provider");
    }
    return context
}