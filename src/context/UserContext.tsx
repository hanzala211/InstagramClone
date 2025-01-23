import { createContext, useContext, useEffect, useState } from "react";
import { ContextChild, UserContextType } from "../types/contextTypes";
import { Post } from "../types/postType";
import { Note } from "../types/note";
import { ProfileStories } from "../types/stories";
import { Highlights, HighlightsStories } from "../types/highlightsType";
import { User, UserFollowDetailsType } from "../types/user";
import { getNote } from "../services/note";
import { useAuth } from "./AuthContext";
import { getArchives } from "../services/archive";

const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider: React.FC<ContextChild> = ({ children }) => {
    const { token } = useAuth()
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
    const [noteLoading, setNoteLoading] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const fetchNote = async () => {
        try {
            setNoteLoading(true);
            const res = await getNote({
                token
            })
            if (res.message !== 'Note not found or expired.') {
                setNote(res.note);
            }
        } catch (error: any) {
            console.error(error)
        } finally {
            setNoteLoading(false);
        }
    }

    const fetchArchives = async () => {
        try {
            setLoadingArchives(true);
            const res = await getArchives({
                token
            })

            if (res.message !== 'No archives found.') {
                setArchives(res.archives);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingArchives(false);
        }
    }

    return <UserContext.Provider value={{ message, setMessage, note, setNote, stories, setStories, archives, setArchives, loadingArchives, setLoadingArchives, currentStory, setCurrentStory, highlights, setHighlights, highLightStories, setHighLightStories, currentHighLight, setCurrentHighLight, userSaves, setUserSaves, userFollowers, setUserFollowers, userFollowing, setUserFollowing, isNoteEditOpen, setIsNoteEditOpen, isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen, innerWidth, setInnerWidth, noteLoading, setNoteLoading, fetchNote, fetchArchives }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser")
    }
    return context;
}

