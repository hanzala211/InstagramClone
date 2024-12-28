import { StoriesStructure } from "./stories";

export interface HighlightsStories extends StoriesStructure{
    user?: string;
    __v?: number;
}

export interface Highlights{
    createdAt: string;
    name: string;
    profilePic?: string;
    stories: HighlightsStories[];
    updatedAt: string;
    user?: string;
    _id: string;
    __v: number;
}