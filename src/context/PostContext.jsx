import { useContext, useState } from "react";
import { createContext } from "react";

const PostContext = createContext();
export function PostProvider({ children }) {
    const [commentValue, setCommentValue] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPostSettingOpen, setIsPostSettingOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isMyPost, setIsMyPost] = useState(false);
    const [isCommented, setIsCommented] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false)
    const [homePosts, setHomePosts] = useState([])
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [isShareOpenHome, setIsShareOpenHome] = useState([])
    const [isShareSearch, setIsShareSearch] = useState("")

    return <PostContext.Provider value={{ commentValue, setCommentValue, isAnimating, setIsAnimating, isPostSettingOpen, setIsPostSettingOpen, isDisabled, setIsDisabled, commentsLoading, setCommentsLoading, isSaved, setIsSaved, isMyPost, setIsMyPost, isCommented, setIsCommented, selectedPost, setSelectedPost, isLiked, setIsLiked, homePosts, setHomePosts, comments, setComments, page, setPage, totalPages, setTotalPages, isShareOpen, setIsShareOpen, isShareSearch, setIsShareSearch, isShareOpenHome, setIsShareOpenHome }}>{children}</PostContext.Provider>
}
export function usePost() {
    const context = useContext(PostContext)
    return context;
}