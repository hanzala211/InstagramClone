import { createContext, useContext, useRef, useState } from "react";

const StoriesContext = createContext()

export function StoriesProvider({ children }) {
    const [selectedImage, setSelectedImage] = useState(null)
    const [result, setResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const fileInputRef = useRef(null)

    return <StoriesContext.Provider value={{ fileInputRef, selectedImage, setSelectedImage, result, setResult, isUploading, setIsUploading, uploaded, setUploaded }}>{children}</StoriesContext.Provider>
}

export function useStories() {
    const context = useContext(StoriesContext)
    return context;
}