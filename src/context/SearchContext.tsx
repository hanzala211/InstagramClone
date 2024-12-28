import { createContext, useContext, useState } from "react";
import { ContextChild, SearchContextType } from "../types/contextTypes";
import { UserInfo } from "../types/user";
import { Post } from "../types/postType";
import { Highlights } from "../types/highlightsType";
import { StoriesStructure } from "../types/stories";

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<ContextChild> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchData, setSearchData] = useState<UserInfo[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<UserInfo | null>(null);
    const [searchUserPosts, setSearchUserPosts] = useState<Post[]>([]);
    const [searchUserStatus, setSearchUserStatus] = useState<StoriesStructure[] | string[]>([]);
    const [searchUserHighLights, setSearchUserHighLights] = useState<Highlights[] | string[]>([]);

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                searchData,
                setSearchData,
                selectedProfile,
                setSelectedProfile,
                searchUserPosts,
                setSearchUserPosts,
                searchUserStatus,
                setSearchUserStatus,
                searchUserHighLights,
                setSearchUserHighLights,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if(!context){
        throw new Error("use useSearch in Search Provider");
    }
    return context;
}
