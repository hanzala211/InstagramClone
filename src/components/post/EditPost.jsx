import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { usePost } from "../../context/PostContext";

export function EditPost({ handleDecrease, handleIncrease, userData, croppedImage, isCaption }) {
    const { captionValue, setCaptionValue, currentIndex, loading } = usePost();

    const handleCaptionChange = (e) => {
        setCaptionValue(e.target.value);
    };

    const renderArrowButtons = () => {
        if (!croppedImage || croppedImage.length <= 1 || loading || !isCaption) return null;

        return (
            <>
                {currentIndex !== croppedImage.length - 1 && (
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full"
                        onClick={handleIncrease}
                    >
                        <FaArrowRight className="fill-black" />
                    </button>
                )}
                {currentIndex !== 0 && (
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full"
                        onClick={handleDecrease}
                    >
                        <FaArrowLeft className="fill-black" />
                    </button>
                )}
            </>
        );
    };

    return (
        <div className="w-full flex flex-row h-full">
            <div className="sm:w-[65%] w-[60%] h-full overflow-hidden relative">
                <img
                    src={croppedImage[currentIndex]}
                    alt="Selected Images"
                    className="object-cover w-full h-full"
                />
                {renderArrowButtons()}
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
                    maxLength={100}
                    value={captionValue}
                    placeholder="Write a Caption"
                    onChange={handleCaptionChange}
                ></textarea>
                <div className="flex justify-end">
                    <p className="text-[#737373] text-[13px] font-semibold">
                        {captionValue?.length}/100
                    </p>
                </div>
            </div>
        </div>
    );
}
