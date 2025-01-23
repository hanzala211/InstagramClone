import { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { ContextChild, PostContextType } from "../types/contextTypes";
import { CommentStructure, CroppedAreas, Post } from "../types/postType";
import { getImageDimensions } from "../utils/cropUtils";
import { captionCreate, getComments, postCreate, postDislike, postLike, postUpdate } from "../services/post";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<ContextChild> = ({ children }) => {
    const { token, userData } = useAuth()
    const { setMessage } = useUser()
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [commentValue, setCommentValue] = useState<string>("");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isPostSettingOpen, setIsPostSettingOpen] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isMyPost, setIsMyPost] = useState<boolean>(false);
    const [isCommented, setIsCommented] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [comments, setComments] = useState<CommentStructure[]>([])
    const [isShareOpen, setIsShareOpen] = useState<boolean>(false)
    const [isShareOpenHome, setIsShareOpenHome] = useState<boolean[]>([])
    const [isShareSearch, setIsShareSearch] = useState<string>("")
    const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
    const [croppedAreas, setCroppedAreas] = useState<CroppedAreas[]>([]);
    const [croppedImages, setCroppedImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCaption, setIsCaption] = useState<boolean>(false);
    const [captionValue, setCaptionValue] = useState<string>("");
    const [isShared, setIsShared] = useState<boolean>(false);
    const [shareLoading, setShareLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (selectedImage !== null) {
            selectedImage?.map((item) => getImageDimensions(item).then((res) => setCroppedAreas((prev: any) => [...prev, res])))
        }
    }, [selectedImage])

    const createPosts = async (isMobile: boolean) => {
        try {
            setShareLoading(true);
            setIsShared(true);
            const res = await postCreate({
                croppedImages,
                token
            })
            setUserPosts((prev: any) => {
                return [...prev, { ...res.post, caption: captionValue.length > 0 ? captionValue : null }]
            })
            if (captionValue.length > 0) {
                const captionRes = await captionCreate({
                    token,
                    res,
                    caption: captionValue
                })
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShareLoading(false);
            if (isMobile) {
                navigate('/home');
            }
            setCaptionValue('');
        }
    }

    const updatePost = async (setIsEditingOpen: any) => {
        try {
            setShareLoading(true);
            setIsShared(true);
            if (setIsEditingOpen !== null) {
                setIsEditingOpen(false);
            }
            const res = await postUpdate({
                selectedPost,
                token,
                raw: {
                    caption: captionValue,
                    isPublic: true,
                }
            })
            if (res.status !== 'fail') {
                setMessage('Post Updated');
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (setIsEditingOpen === null) {
                navigate('/home');
            }
            setIsShared(false);
            setShareLoading(false);
            setCaptionValue('');
        }
    }

    const fetchComments = async (signal: any) => {
        try {
            if (selectedPost !== null) {
                setComments([]);
                setCommentsLoading(true);
                const res = await getComments({
                    selectedPost,
                    token,
                    signal,
                    page: page
                })
                if (res.data.comments.length === 0) {
                    setCommentsLoading(false);
                }
                setTotalPages(res.data.totalPages);
                setComments((prev: any) => {
                    const newComments = res.data.comments.filter((newComment: any) => {
                        return !prev.some(
                            (existingComment: any) => existingComment._id === newComment._id
                        );
                    });
                    return [...newComments, ...prev];
                });

                await Promise.all(
                    res.data.comments.map((comment: any) => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = comment.user.profilePic;
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    })
                ).finally(() => {
                    if (!signal.aborted) {
                        setCommentsLoading(false);
                    }
                });
            }
        } catch (error: any) {
            if (error.name !== 'AbortError' && error.name !== 'TypeError') {
                console.error('Fetch failed:', error);
            }
        }
    }

    const likePost = async () => {
        try {
            setSelectedPost((prev: any) => {
                const hasLiked = prev.likes.some(
                    (item: any) => item === userData.data.user._id
                );
                return {
                    ...prev,
                    likeCount: hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
                    likes: hasLiked
                        ? prev.likes.filter((item: any) => item !== userData?.data.user._id)
                        : [...prev.likes, userData?.data.user._id],
                };
            });
            const res = await postLike({
                selectedPost,
                token,
            })
            if (res.message !== 'Post liked successfully.') {
                setIsLiked((prev: any) => !prev);
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const disLikePost = async () => {
        try {
            setSelectedPost((prev: any) => {
                const hasLiked = prev.likes.some(
                    (item: any) => item === userData.data.user._id
                );
                return {
                    ...prev,
                    likeCount: hasLiked ? prev.likeCount - 1 : prev.likeCount + 1,
                    likes: hasLiked
                        ? prev.likes.filter((item: any) => item !== userData.data.user._id) // Remove like
                        : [...prev.likes, userData.data.user._id], // Add like
                };
            });
            const res = await postDislike({
                selectedPost,
                token,
            })
            if (res.message !== 'Post disliked successfully.') {
                setIsLiked((prev: any) => !prev);
            } else {
                setMessage(res.message);
            }
        } catch (error: any) {
            if (error.message !== "AbortError: signal is aborted without reason") {
                console.error(error);
            }
        }
    }

    return <PostContext.Provider value={{ userPosts, setUserPosts, commentValue, setCommentValue, isAnimating, setIsAnimating, isPostSettingOpen, setIsPostSettingOpen, isDisabled, setIsDisabled, commentsLoading, setCommentsLoading, isSaved, setIsSaved, isMyPost, setIsMyPost, isCommented, setIsCommented, selectedPost, setSelectedPost, isLiked, setIsLiked, comments, setComments, isShareOpen, setIsShareOpen, isShareSearch, setIsShareSearch, isShareOpenHome, setIsShareOpenHome, fileInputRef, selectedImage, setSelectedImage, croppedAreas, setCroppedAreas, setCroppedImages, croppedImages, currentIndex, setCurrentIndex, loading, setLoading, isCaption, setIsCaption, captionValue, setCaptionValue, isShared, setIsShared, shareLoading, setShareLoading, createPosts, updatePost, totalPages, setTotalPages, page, setPage, fetchComments, likePost, disLikePost }}>{children}</PostContext.Provider>
}
export const usePost = (): PostContextType => {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error("use usePost in Post Provider");
    }
    return context;
}