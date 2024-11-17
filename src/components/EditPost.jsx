import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function EditPost({ croppedImage, currentIndex, handleDecrease, handleIncrease, loading, isCaption, setCaptionValue, userData, captionValue }) {
    return <div className="w-full flex flex-row h-full">
        <div className="w-[70%] h-full overflow-hidden relative">
            <img src={croppedImage[currentIndex]} alt="Selected Images" className="object-cover w-full h-full" />
            {(!croppedImage || croppedImage.length > 1) && !loading && isCaption ?
                <>
                    {currentIndex !== croppedImage.length - 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleIncrease}><FaArrowRight className="fill-black" /></button>}
                    {currentIndex !== 0 && <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleDecrease}><FaArrowLeft className="fill-black" /></button>}
                </> : ""}
        </div>
        <div className="w-[30%] px-4 py-5 border-l-[2px] border-[#363636]">
            <div className="flex flex-row gap-4 items-center">
                <img src={userData.data.user.profilePic} className="w-8 rounded-full" alt="Profile Pic" />
                <p className="text-[14px] font-semibold">{userData.data.user.userName}</p>
            </div>
            <textarea className="bg-transparent h-[10rem] text-white outline-none resize-none w-full mt-4" maxLength={2000} value={captionValue} onChange={(e) => setCaptionValue(e.target.value)}></textarea>
            <div className="flex justify-end">
                <p className="text-[#737373] text-[13px] font-semibold">{captionValue.length}/2000</p>
            </div>
        </div>
    </div>
}