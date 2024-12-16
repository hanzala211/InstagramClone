import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
export function UserProvider({ children }) {
    const [userData, setUserData] = useState({});
    const [mainLoading, setMainLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [message, setMessage] = useState("");
    const [note, setNote] = useState([]);
    const [stories, setStories] = useState([]);
    const [archives, setArchives] = useState([])
    const [currentStory, setCurrentStory] = useState(0);
    const [loadingArchives, setLoadingArchives] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [highLightStories, setHighLightStories] = useState([])
    const [currentHighLight, setCurrentHighLight] = useState(0)
    const [userSaves, setUserSaves] = useState([]);
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowing, setUserFollowing] = useState([])
    const [isNoteEditOpen, setIsNoteEditOpen] = useState(false);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false)
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false)
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <UserContext.Provider value={{ userData, setUserData, mainLoading, setMainLoading, userPosts, setUserPosts, message, setMessage, note, setNote, stories, setStories, archives, setArchives, loadingArchives, setLoadingArchives, currentStory, setCurrentStory, highlights, setHighlights, highLightStories, setHighLightStories, currentHighLight, setCurrentHighLight, userSaves, setUserSaves, userFollowers, setUserFollowers, userFollowing, setUserFollowing, isNoteEditOpen, setIsNoteEditOpen, isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen, innerWidth, setInnerWidth }}>{children}</UserContext.Provider>
}

export function useUser() {
    const context = useContext(UserContext);
    return context;
}

const SideBarContext = createContext();

export function SideBarProvider({ children }) {
    const [isSearching, setIsSearching] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createStory, setCreateStory] = useState(false);

    return <SideBarContext.Provider value={{ isSearching, setIsSearching, isCreating, setIsCreating, createStory, setCreateStory }}>{children}</SideBarContext.Provider>
}

export function useSideBar() {
    const context = useContext(SideBarContext)
    return context;
}

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

