import { IoCloseSharp } from "react-icons/io5";
import { useUser } from "../context/UserContext"
import { Link, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function Story() {
    const { stories, userData } = useUser();
    const [currentStory, setCurrentStory] = useState(0);
    const navigate = useNavigate();
    function handleIncrease() {
        setCurrentStory((prev) => prev + 1);
    }
    function handleDecrease() {
        setCurrentStory((prev) => prev - 1);
    }
    return <section className="bg-[#1A1A1A] relative w-[100vw] h-[100vh] p-4 flex justify-between flex-row items-start">
        <img src="/images/instagramiconswhite.png" alt="Instagram Icon" className="w-28" />
        <div className="w-[32rem] rounded-xl">
            <div className="absolute top-7 px-3 w-[32rem]">
                <div className="w-full flex gap-1.5">
                    {stories.map((item, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-[2px] ${currentStory >= i ? "bg-white" : "bg-white opacity-50"}`}
                        ></div>
                    ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <img src={userData.data.user.profilePic} className="w-11 rounded-full" alt="profilePic" />
                    <Link to={`/${userData.data.user.userName}`} className="font-semibold text-[14px] flex items-center gap-1">{userData.data.user.userName}
                        {userData.data.user.followers.length > 0 && <MdVerified className="fill-white" />}
                    </Link>

                </div>
            </div>
            <img src={stories[currentStory].imageUrl} alt="Story" className="w-full rounded-xl" />
        </div>
        <button onClick={() => navigate(-1)}>
            <IoCloseSharp className="text-[35px]" />
        </button>
        {stories.length > 1 ? <> {currentStory !== stories.length - 1 && <button className="absolute right-[38rem] top-1/2 -translate-y-[20%] p-2 bg-white rounded-full" onClick={handleIncrease}><FaArrowRight className="fill-black" /></button>}
            {currentStory !== 0 && <button className="absolute left-[43rem] top-1/2 -translate-y-[50%] p-2 bg-white rounded-full" onClick={handleDecrease}><FaArrowLeft className="fill-black" /></button>}
        </> : ""}
    </section>
}