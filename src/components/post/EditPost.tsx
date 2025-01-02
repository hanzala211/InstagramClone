import { usePost } from "../../context/PostContext";
import { User } from "../../types/user";
import { PostSliderButtons } from "./PostSliderButtons";

interface EditPostProps {
    handleDecrease: () => void;
    handleIncrease: () => void;
    userData: User | null;
    croppedImage: string[];
    isCaption: boolean;
}

export const EditPost: React.FC<EditPostProps> = ({ handleDecrease, handleIncrease, userData, croppedImage, isCaption }) => {
    const { captionValue, setCaptionValue, currentIndex } = usePost();

    const handleCaptionChange = (e: any) => {
        setCaptionValue(e.target.value);
    };

    return (
        <div className="w-full flex flex-row h-full">
            <div className="sm:w-[65%] flex items-center w-[60%] h-full overflow-hidden relative">
                <img
                    src={croppedImage[currentIndex]}
                    alt="Selected Images"
                    className="object-contain w-full h-[97%]"
                />
                <PostSliderButtons posts={croppedImage} currentPost={currentIndex} handleDecrease={handleDecrease} handleIncrease={handleIncrease} isPostSlider={true} isHome={true} />
            </div>

            <div className="sm:w-[35%] w-[40%] md:px-4 p-2 md:py-5 border-l-[2px] border-[#363636]">
                <div className="flex flex-row md:gap-4 gap-2 items-center">
                    <img
                        src={userData.data.user.profilePic}
                        className="md:w-8 w-5 rounded-full"
                        alt="Profile Pic"
                    />
                    <p className="md:text-[14px] text-[12px] font-semibold">
                        {userData.data.user.userName}
                    </p>
                </div>

                <textarea
                    className="bg-transparent border-b-[1px] md:h-[10rem] h-[7rem] text-white outline-none resize-none w-full mt-4 md:text-[16px] text-[12px]"
                    maxLength={200}
                    value={captionValue}
                    placeholder="Write a Caption"
                    onChange={handleCaptionChange}
                ></textarea>
                <div className="flex justify-end">
                    <p className="text-[#737373] text-[13px] font-semibold">
                        {captionValue?.length}/200
                    </p>
                </div>
            </div>
        </div>
    );
}
