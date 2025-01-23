import { createContext, useContext, useState } from "react";
import { ContextChild, SearchContextType } from "../types/contextTypes";
import { UserInfo } from "../types/user";
import { Post } from "../types/postType";
import { Highlights } from "../types/highlightsType";
import { StoriesStructure } from "../types/stories";
import { getPost } from "../services/searchProfile";
import { getSearch } from "../services/search";
import { useAuth } from "./AuthContext";

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<ContextChild> = ({ children }) => {
    const { userData } = useAuth()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchData, setSearchData] = useState<UserInfo[]>([]);
    const [searchUserPosts, setSearchUserPosts] = useState<Post[]>([]);
    const [searchUserStatus, setSearchUserStatus] = useState<StoriesStructure[] | string[]>([]);
    const [searchUserHighLights, setSearchUserHighLights] = useState<Highlights[] | string[]>([]);
    const [explorePagePosts, setExplorePagePosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);


    const fetchPosts = async (postID: string) => {
        const localitem: string | null = JSON.parse(localStorage.getItem("token") || "null");
        try {
            setPostsLoading(true);
            const res = await getPost({
                postID,
                token: localitem
            })
            return res;
        } catch (error) {
            console.error(error)
        }
    }


    const fetchSearch = async (signal: any, searchText: string, token: any) => {
        try {
            setSearchData([]);
            const res = await getSearch({
                searchQuery: searchText,
                signal,
                token
            })
            console.log(res)
            if (res.status !== 'fail') {
                const loadedImagesPromises = res.data.map((item: any) => {
                    return new Promise((resolve: any) => {
                        const img = new Image();
                        img.src = item.profilePic;
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    });
                });
                await Promise.all(loadedImagesPromises).finally(() =>
                    setSearchLoading(false)
                );
                setSearchData((prev) => {
                    const newItems = res.data.filter(
                        (item: any) =>
                            item._id !== userData?.data.user._id &&
                            !prev.some((existingItem) => existingItem._id === item._id)
                    );
                    return [...prev, ...newItems];
                });
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    }

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                searchData,
                setSearchData,
                searchUserPosts,
                setSearchUserPosts,
                searchUserStatus,
                setSearchUserStatus,
                searchUserHighLights,
                setSearchUserHighLights,
                explorePagePosts,
                setExplorePagePosts,
                postsLoading,
                setPostsLoading,
                fetchPosts,
                fetchSearch,
                searchLoading,
                setSearchLoading
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("use useSearch in Search Provider");
    }
    return context;
}
