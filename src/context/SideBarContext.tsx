import { createContext, useContext, useState } from "react";
import { ContextChild, SideBarContextType } from "../types/contextTypes";

const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

export const SideBarProvider: React.FC<ContextChild> = ({ children }) => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [createStory, setCreateStory] = useState<boolean>(false);

    return <SideBarContext.Provider value={{ isSearching, setIsSearching, isCreating, setIsCreating, createStory, setCreateStory }}>{children}</SideBarContext.Provider>
}

export const useSideBar =(): SideBarContextType => {
    const context = useContext(SideBarContext)
    if(!context){
        throw new Error("useSidbar in SideBar Provider");
    }
    return context;
}
