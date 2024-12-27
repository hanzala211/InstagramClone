export interface Messages{
    id: string;
    content?: string;
    senderId?: number;
    timeStamp?: unknown;
    post?: Post;
}

export interface Post{
    _id: string;
    caption: string | null;
    commentsCount: number;
    createdAt: string;
    imageUrls: string[];
    likeCount: number;
    likes: string[];
    user: PostUserData;
}

export interface PostUserData{
    _id: string;
    profilePic: string;
    userName: string;
}