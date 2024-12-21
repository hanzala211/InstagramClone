import { createContext, useContext, useState } from "react";

const HomeContext = createContext()

export function HomeProvider({ children }) {
    const [homeStories, setHomeStories] = useState([])
    return <HomeContext.Provider value={{ homeStories, setHomeStories }}>{children}</HomeContext.Provider>
}

export function useHome() {
    const context = useContext(HomeContext)
    return context
}