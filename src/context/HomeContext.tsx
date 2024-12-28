import { createContext, useContext, useState } from "react";
import { ContextChild, HomeContextType } from "../types/contextTypes";
import { Post } from "../types/postType";
import { HomeStories } from "../types/stories";

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const HomeProvider: React.FC<ContextChild> = ({ children }) => {
    const [homeStories, setHomeStories] = useState<HomeStories[]>([])
    const [totalPages, setTotalPages] = useState<number>(0);
    const [homePosts, setHomePosts] = useState<Post[]>([])
    const [page, setPage] = useState<number>(1)

    return <HomeContext.Provider value={{ homeStories, setHomeStories, totalPages, setTotalPages, homePosts, setHomePosts, page, setPage }}>{children}</HomeContext.Provider>
}

export const useHome = () : HomeContextType => {
    const context = useContext(HomeContext)
    if(!context){
        throw new Error("use useHome in Home Provider");
    }
    return context
}