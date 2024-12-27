import { ReactNode } from "react";
import { UserData } from "./user";
import { Messages } from "./chatType";

export interface ContextChild{
    children: ReactNode;
}

export interface ChatContextType{
    userData: any;
    isChatSearch: boolean;
    setIsChatSearch: (value: boolean) => void;
    selectedChat: UserData | null;
    setSelectedChat: (selectedUser: UserData | null) => void;
    searchData: [];
    setSearchData: (data: []) => void;
    searchChatValue: string;
    setSearchChatValue: (value: string) => void;
    messages: Messages[];
    setMessages: (message: Messages[]) => void;
    threads: [];
    setThreads: (thread: []) => void;
    notifications: [];
    setNotifications: (notification: []) => void;
    messagesLoading: boolean;
    setMessagesLoading: (value: boolean) => void;
    threadsLoading: boolean;
    setThreadsLoading: (value: boolean) => void;
    isInfoOpen: boolean;
    setIsInfoOpen: (value: boolean) => void;
    location: Location;
} 