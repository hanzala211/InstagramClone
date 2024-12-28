export interface StoriesStructure{
    createdAt?: string;
    expiresAt?: string;
    imageUrl?: string;
    _id?: string;
}

export interface ProfileStories extends StoriesStructure{
    updatedAt?: string;
    __v?: number;
    user?: string;
}

export interface HomeStoriesUser{
    fullName: string;
    userName: string;
    _id:string;
    profilePic: string;
    stories: ProfileStories[];
}

export interface HomeStories {
    user: HomeStoriesUser
}