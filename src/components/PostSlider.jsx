import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { usePost } from "../context/PostContext"
import { useState } from "react";
import { LikePost } from "../assets/Constants";
import { useUser } from "../context/UserContext";
import { likePost } from "../utils/helper";

export function PostSlider({ currentIndex, setCurrentIndex }) {
    const { isAnimating, selectedPost, setSelectedPost, isLiked, setIsLiked, setIsAnimating } = usePost()
    const { userData, setMessage } = useUser()
    const [showHeart, setShowHeart] = useState(false);
    const [heartIndex, setHeartIndex] = useState(null);

    const handleDoubleClick = (index) => {
        setHeartIndex(index);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!isLiked) {
            likePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage)
        }
    };

    function handleIncrease() {
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1)
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }

    function handleDecrease() {
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1)
        setTimeout(() => {
            setIsAnimating(false)
        }, 400);
    }
    return <div className="1280:w-[47rem] lg:w-[50rem] w-[55rem] relative overflow-hidden">
        <div className={`w-full relative flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
            {selectedPost !== null
                ? selectedPost.imageUrls.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-full h-full"
                        >
                            <img
                                src={item}
                                alt="Post"
                                onDoubleClick={() => handleDoubleClick(index)}
                                className="object-fill h-full w-full"
                            />
                            {showHeart && heartIndex === index && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-red-500 text-6xl animate-popAndMoveUp">
                                        <LikePost />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
                : ""}
        </div>
        {selectedPost !== null && selectedPost.imageUrls.length > 1 ? (
            <>
                {currentIndex !== selectedPost.imageUrls.length - 1 && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleIncrease}>
                        <FaArrowRight className="fill-black" />
                    </button>
                )}
                {currentIndex !== 0 && (
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" onClick={handleDecrease}>
                        <FaArrowLeft className="fill-black" />
                    </button>
                )}
            </>
        ) : ""}
    </div>
}