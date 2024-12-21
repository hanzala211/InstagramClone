import { useContext, useRef, useState } from "react";
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
    const [comments, setComments] = useState([])
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [isShareOpenHome, setIsShareOpenHome] = useState([])
    const [isShareSearch, setIsShareSearch] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [croppedImages, setCroppedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCaption, setIsCaption] = useState(false);
    const [captionValue, setCaptionValue] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const fileInputRef = useRef(null);


    return <PostContext.Provider value={{ commentValue, setCommentValue, isAnimating, setIsAnimating, isPostSettingOpen, setIsPostSettingOpen, isDisabled, setIsDisabled, commentsLoading, setCommentsLoading, isSaved, setIsSaved, isMyPost, setIsMyPost, isCommented, setIsCommented, selectedPost, setSelectedPost, isLiked, setIsLiked, comments, setComments, isShareOpen, setIsShareOpen, isShareSearch, setIsShareSearch, isShareOpenHome, setIsShareOpenHome, fileInputRef, selectedImage, setSelectedImage, croppedAreas, setCroppedAreas, setCroppedImages, croppedImages, currentIndex, setCurrentIndex, loading, setLoading, isCaption, setIsCaption, captionValue, setCaptionValue, isShared, setIsShared, shareLoading, setShareLoading }}>{children}</PostContext.Provider>
}
export function usePost() {
    const context = useContext(PostContext)
    return context;
}