import { Highlights } from "./highlightsType";
import { Note } from "./note";
import { StoriesStructure } from "./stories";

export interface User{
    status: string;
    data: UserData | any;
    error?: any,
}

export interface UserData{
    token?: string;
    user: UserInfo;
}

export interface UserInfo{
    _id?: string;
    fullName?: string;
    userName?: string;
    profilePic?: string;
    bio?: string;
    followers?: string[];
    notes?: string[] | Note[];
    following?: string[];
    savedPosts?: string[];
    posts?: string[];
    gender?: string;
    websiteUrl?: unknown;
    isActive?: boolean;
    isBlocked?: boolean;
    isSuspended?: boolean;
    isPublic?: boolean;
    email?: string;
    password?: string;
    forgotPasswordCode?: unknown;
    passwordResetCodeExpiry?: unknown;
    postCount?: number;
    followersCount?: number | undefined;
    followingCount?: number | undefined;
    stories?: string[] | StoriesStructure[];
    highlights?: string[] | Highlights[];
    highlightsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface UserFollowDetailsType{
    fullName: string;
    userName: string;
    gender: "Male";
    id: string;
    profilePic: string;
}

export interface EditForm {
    heading: string;
    maxLength: number;
    minLength: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}