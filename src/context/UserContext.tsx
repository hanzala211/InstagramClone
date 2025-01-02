import { createContext, useContext, useEffect, useState } from "react";
import { ContextChild, SideBarContextType, UserContextType } from "../types/contextTypes";
import { Post } from "../types/postType";
import { Note } from "../types/note";
import { ProfileStories } from "../types/stories";
import { Highlights, HighlightsStories } from "../types/highlightsType";
import { User, UserFollowDetailsType } from "../types/user";

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider: React.FC<ContextChild> = ({ children }) => {
    const [userData, setUserData] = useState<User | any>(null);
    const [mainLoading, setMainLoading] = useState<boolean>(true);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [message, setMessage] = useState<any>("");
    const [note, setNote] = useState<Note | []>([]);
    const [stories, setStories] = useState<ProfileStories[]>([]);
    const [archives, setArchives] = useState<ProfileStories[]>([])
    const [currentStory, setCurrentStory] = useState<number>(0);
    const [loadingArchives, setLoadingArchives] = useState<boolean>(false);
    const [highlights, setHighlights] = useState<Highlights[]>([]);
    const [highLightStories, setHighLightStories] = useState<HighlightsStories[]>([])
    const [currentHighLight, setCurrentHighLight] = useState<number>(0)
    const [userSaves, setUserSaves] = useState<Post[]>([]);
    const [userFollowers, setUserFollowers] = useState<UserFollowDetailsType[]>([])
    const [userFollowing, setUserFollowing] = useState<UserFollowDetailsType[]>([])
    const [isNoteEditOpen, setIsNoteEditOpen] = useState<boolean>(false);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState<boolean>(false)
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState<boolean>(false)
    const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <UserContext.Provider value={{ userData, setUserData, mainLoading, setMainLoading, userPosts, setUserPosts, message, setMessage, note, setNote, stories, setStories, archives, setArchives, loadingArchives, setLoadingArchives, currentStory, setCurrentStory, highlights, setHighlights, highLightStories, setHighLightStories, currentHighLight, setCurrentHighLight, userSaves, setUserSaves, userFollowers, setUserFollowers, userFollowing, setUserFollowing, isNoteEditOpen, setIsNoteEditOpen, isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen, innerWidth, setInnerWidth }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser")
    }
    return context;
}

