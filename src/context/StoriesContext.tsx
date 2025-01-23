import { createContext, useContext, useRef, useState } from "react";
import { ContextChild, StoriesContextType } from "../types/contextTypes";

const StoriesContext = createContext<StoriesContextType | undefined>(undefined)

export const StoriesProvider: React.FC<ContextChild> = ({ children }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploaded, setUploaded] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null)

    return <StoriesContext.Provider value={{ fileInputRef, selectedImage, setSelectedImage, isUploading, setIsUploading, uploaded, setUploaded }}>{children}</StoriesContext.Provider>
}

export const useStories = (): StoriesContextType => {
    const context = useContext(StoriesContext)
    if (!context) {
        throw new Error("use useStories within Stories Provider");
    }
    return context;
}