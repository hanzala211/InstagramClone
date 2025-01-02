import { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { ContextChild, PostContextType } from "../types/contextTypes";
import { CommentStructure, CroppedAreas, Post } from "../types/postType";
import { getImageDimensions } from "../utils/cropUtils";

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<ContextChild> = ({ children }) => {
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedImage !== null) {
            selectedImage?.map((item) => getImageDimensions(item).then((res) => setCroppedAreas((prev: any) => [...prev, res])))
        }
    }, [selectedImage])

    return <PostContext.Provider value={{ commentValue, setCommentValue, isAnimating, setIsAnimating, isPostSettingOpen, setIsPostSettingOpen, isDisabled, setIsDisabled, commentsLoading, setCommentsLoading, isSaved, setIsSaved, isMyPost, setIsMyPost, isCommented, setIsCommented, selectedPost, setSelectedPost, isLiked, setIsLiked, comments, setComments, isShareOpen, setIsShareOpen, isShareSearch, setIsShareSearch, isShareOpenHome, setIsShareOpenHome, fileInputRef, selectedImage, setSelectedImage, croppedAreas, setCroppedAreas, setCroppedImages, croppedImages, currentIndex, setCurrentIndex, loading, setLoading, isCaption, setIsCaption, captionValue, setCaptionValue, isShared, setIsShared, shareLoading, setShareLoading }}>{children}</PostContext.Provider>
}
export const usePost = (): PostContextType => {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error("use usePost in Post Provider");
    }
    return context;
}