import { createContext, useContext, useState } from "react";

const HomeContext = createContext()

export function HomeProvider({ children }) {
    const [homeStories, setHomeStories] = useState([])
    const [totalPages, setTotalPages] = useState(0);
    const [homePosts, setHomePosts] = useState([])
    const [page, setPage] = useState(1)
    return <HomeContext.Provider value={{ homeStories, setHomeStories, totalPages, setTotalPages, homePosts, setHomePosts, page, setPage }}>{children}</HomeContext.Provider>
}

export function useHome() {
    const context = useContext(HomeContext)
    return context
}