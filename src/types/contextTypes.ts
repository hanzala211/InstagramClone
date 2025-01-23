import { ReactNode } from "react";
import { User, UserData, UserFollowDetailsType, UserInfo } from "./user";
import { Messages, Notification, Thread } from "./chatType";
import { HomeStories, ProfileStories, StoriesStructure } from "./stories";
import { CommentStructure, CroppedAreas, Post } from "./postType";
import { Location } from "react-router-dom";
import { Highlights, HighlightsStories } from "./highlightsType";
import { Note } from "./note";

export interface ContextChild {
    children: ReactNode;
}

export interface ChatContextType {
    userData: User | null;
    isChatSearch: boolean;
    setIsChatSearch: React.Dispatch<React.SetStateAction<boolean>>;
    selectedChat: UserInfo | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    searchData: UserInfo[];
    setSearchData: React.Dispatch<React.SetStateAction<UserInfo[]>>;
    searchChatValue: string;
    setSearchChatValue: React.Dispatch<React.SetStateAction<string>>;
    messages: Messages[];
    setMessages: React.Dispatch<React.SetStateAction<Messages[]>>;
    threads: Thread[];
    setThreads: React.Dispatch<React.SetStateAction<Thread[] | []>>;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    messagesLoading: boolean;
    setMessagesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    threadsLoading: boolean;
    setThreadsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isInfoOpen: boolean;
    setIsInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
    location: Location;
}

export interface HomeContextType {
    homeStories: HomeStories[];
    setHomeStories: React.Dispatch<React.SetStateAction<HomeStories[]>>;
    homePosts: Post[];
    setHomePosts: React.Dispatch<React.SetStateAction<Post[]>>;
    savedPosts: boolean[];
    setSavedPosts: React.Dispatch<React.SetStateAction<boolean[]>>;
    likedPosts: boolean[];
    setLikedPosts: React.Dispatch<React.SetStateAction<boolean[]>>;
    isHovered: boolean[],
    setIsHovered: React.Dispatch<React.SetStateAction<boolean[]>>;
    likeHomePost: (id: string, index: number) => Promise<void>,
    disLikeHomePost: (id: string, index: number) => Promise<void>,
}

export interface PostContextType {
    userPosts: Post[];
    setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    commentValue: string;
    setCommentValue: React.Dispatch<React.SetStateAction<string>>;
    isAnimating: boolean;
    setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
    isPostSettingOpen: boolean
    setIsPostSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDisabled: boolean;
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    commentsLoading: boolean;
    setCommentsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSaved: boolean;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
    isMyPost: boolean;
    setIsMyPost: React.Dispatch<React.SetStateAction<boolean>>;
    isCommented: boolean;
    setIsCommented: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPost: Post | null;
    setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
    isLiked: boolean;
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
    comments: CommentStructure[];
    setComments: React.Dispatch<React.SetStateAction<CommentStructure[]>>;
    isShareOpen: boolean;
    setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isShareOpenHome: boolean[];
    setIsShareOpenHome: React.Dispatch<React.SetStateAction<boolean[]>>;
    isShareSearch: string;
    setIsShareSearch: React.Dispatch<React.SetStateAction<string>>;
    selectedImage: string[] | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<string[] | null>>;
    croppedAreas: CroppedAreas[];
    setCroppedAreas: React.Dispatch<React.SetStateAction<CroppedAreas[]>>;
    croppedImages: string[];
    setCroppedImages: React.Dispatch<React.SetStateAction<string[]>>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isCaption: boolean;
    setIsCaption: React.Dispatch<React.SetStateAction<boolean>>;
    captionValue: string;
    setCaptionValue: React.Dispatch<React.SetStateAction<string>>;
    isShared: boolean;
    setIsShared: React.Dispatch<React.SetStateAction<boolean>>;
    shareLoading: boolean;
    setShareLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    createPosts: (isMobile: boolean) => Promise<void>,
    updatePost: (setIsEditingOpen: any) => Promise<void>,
    totalPages: number;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    fetchComments: (signal: any) => Promise<void>,
    likePost: () => void,
    disLikePost: () => void
}

export interface SearchContextType {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchData: UserInfo[];
    setSearchData: React.Dispatch<React.SetStateAction<UserInfo[]>>;
    searchUserPosts: Post[];
    setSearchUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    searchUserStatus: StoriesStructure[] | string[];
    setSearchUserStatus: React.Dispatch<React.SetStateAction<StoriesStructure[] | string[]>>;
    searchUserHighLights: Highlights[] | string[];
    setSearchUserHighLights: React.Dispatch<React.SetStateAction<Highlights[] | string[]>>
    explorePagePosts: Post[];
    setExplorePagePosts: React.Dispatch<React.SetStateAction<Post[]>>,
    postsLoading: boolean,
    setPostsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    fetchPosts: (postID: string) => Promise<any>,
    fetchSearch: (signal: any, searchQuery: string, token: any) => Promise<void>,
    searchLoading: boolean,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface StoriesContextType {
    selectedImage: string | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
    isUploading: boolean;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
    uploaded: boolean;
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface UserContextType {
    message: any;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    note: Note | [];
    setNote: React.Dispatch<React.SetStateAction<Note | []>>;
    stories: ProfileStories[];
    setStories: React.Dispatch<React.SetStateAction<ProfileStories[]>>;
    archives: ProfileStories[];
    setArchives: React.Dispatch<React.SetStateAction<ProfileStories[]>>;
    currentStory: number;
    setCurrentStory: React.Dispatch<React.SetStateAction<number>>;
    loadingArchives: boolean;
    setLoadingArchives: React.Dispatch<React.SetStateAction<boolean>>;
    highlights: Highlights[];
    setHighlights: React.Dispatch<React.SetStateAction<Highlights[]>>;
    highLightStories: HighlightsStories[];
    setHighLightStories: React.Dispatch<React.SetStateAction<HighlightsStories[]>>;
    currentHighLight: number;
    setCurrentHighLight: React.Dispatch<React.SetStateAction<number>>;
    userSaves: Post[];
    setUserSaves: React.Dispatch<React.SetStateAction<Post[]>>;
    userFollowers: UserFollowDetailsType[];
    setUserFollowers: React.Dispatch<React.SetStateAction<UserFollowDetailsType[]>>;
    userFollowing: UserFollowDetailsType[];
    setUserFollowing: React.Dispatch<React.SetStateAction<UserFollowDetailsType[]>>;
    isNoteEditOpen: boolean;
    setIsNoteEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isFollowerModalOpen: boolean;
    setIsFollowerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isFollowingModalOpen: boolean;
    setIsFollowingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    innerWidth: number;
    setInnerWidth: React.Dispatch<React.SetStateAction<number>>;
    noteLoading: boolean,
    setNoteLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchNote: () => void,
    fetchArchives: () => void,
}

export interface SideBarContextType {
    isSearching: boolean;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    isCreating: boolean;
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
    createStory: boolean;
    setCreateStory: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthContextType {
    userData: User | any;
    setUserData: React.Dispatch<React.SetStateAction<User | any>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    userValue: string,
    setUserValue: React.Dispatch<React.SetStateAction<string>>;
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    mainLoading: boolean;
    setMainLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchLogin: () => void,
    fetchSignup: () => void;
    succesMessage: string,
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
    fullName: string,
    setFullName: React.Dispatch<React.SetStateAction<string>>;
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    forgotResult: any;
    setForgotResult: React.Dispatch<React.SetStateAction<string>>;
    codeValue: string;
    setCodeValue: React.Dispatch<React.SetStateAction<string>>;
    forgotPassword: () => void;
    resetPassword: () => void,
    selectedProfile: UserInfo | null;
    setSelectedProfile: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    fetchMe: (localitem: string | null) => Promise<void>
}