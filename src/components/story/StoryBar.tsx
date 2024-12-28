import { Highlights } from "../../types/highlightsType";
import { ProfileStories } from "../../types/stories";

interface StoryBarProps{
    isProfile: boolean;
    story: ProfileStories[] | Highlights[];
    currentStory: number
}

export const StoryBar: React.FC<StoryBarProps> = ({isProfile, story, currentStory}) => {
    return <>
       {isProfile && story.map((item: any, i: number) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}></div>
       ))}
    </>
}