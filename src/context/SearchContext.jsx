import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState([]);
    const [searchUserPosts, setSearchUserPosts] = useState([])
    const [searchUserStatus, setSearchUserStatus] = useState([])
    const [searchUserHighLights, setSearchUserHighLights] = useState([]);


    return <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchData, setSearchData, selectedProfile, setSelectedProfile, searchUserPosts, setSearchUserPosts, searchUserStatus, setSearchUserStatus, searchUserHighLights, setSearchUserHighLights }}>{children}</SearchContext.Provider>
}
export function useSearch() {
    const context = useContext(SearchContext);
    return context;
}
