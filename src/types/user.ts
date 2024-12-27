export interface User{
    status: string;
    data: UserData;
}

export interface UserData{
    token?: string;
    user: UserInfo;
}

export interface UserInfo{
    _id: string;
    fullName: string;
    userName: string;
    profilePic: string;
    bio: string;
    followers: string[];
    notes: string[];
    following: string[];
    savedPosts: string[];
    posts: string[];
    gender: string;
    websiteUrl: unknown;
    isActive: boolean;
    isBlocked: boolean;
    isSuspended: boolean;
    isPublic: boolean;
    email: string;
    password?: string;
    forgotPasswordCode?: unknown;
    passwordResetCodeExpiry?: unknown;
    postCount: number;
    followersCount: number;
    followingCount: number;
    stories: string[];
    highlights: string[];
    highlightsCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}