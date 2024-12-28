export interface Post{
    _id: string;
    caption: string | null;
    commentsCount: number;
    comments?: CommentStructure[];
    createdAt: string;
    imageUrls: string[];
    likeCount: number;
    likes: string[];
    user?: PostUserData | string;
    postBy?: PostUserData | string;
    __v?: number;
    updatedAt?: string;
    isPublic?: boolean;
}

export interface PostUserData{
    _id?: string;
    profilePic?: string;
    userName?: string;
    email?:string;
    fullName?: string;
}

export interface CommentStructure{
    comment: string;
    createdAt: string;
    user?: PostUserData | string;
    _id: string;
}

export interface CroppedAreas{
    width: number;
    height: number;
    x: number;
    y: number;
}