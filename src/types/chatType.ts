import { Post } from "./postType";

export interface Messages {
    id?: string;
    content?: string;
    senderId?: number;
    timeStamp?: unknown;
    post?: Post;
    status?: string;
    sender?: string;
    userName?: string
}

export interface Thread {
    lastMessage: string;
    lastMessageSender: string;
    participants?: string[];
    timeStamp?: unknown;
    deleted?: {
        userId: boolean;
    }
}

export interface Notification {
    messageSender?: string;
    read?: boolean;
    timeStamp?: unknown;
    userId?: string;
    id?: string;
}