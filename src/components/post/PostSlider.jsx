import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { usePost } from "../../context/PostContext"
import { useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { LikeAnimation } from "./LikeAnimation";
import { likePost } from "../../services/post";

export function PostSlider({ currentIndex, setCurrentIndex }) {
    const { isAnimating, selectedPost, setSelectedPost, isLiked, setIsLiked, setIsAnimating } = usePost()
    const { userData, setMessage } = useUser()
    const [showHeart, setShowHeart] = useState(false);
    const [heartIndex, setHeartIndex] = useState(null);
    const lastTouchTime = useRef(0);

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
    return <div className="1280:w-[47rem] lg:w-[65rem] md:w-[85rem] w-[100vw] 440:w-[26.9rem] relative overflow-hidden">
        <div className={`w-full relative flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""} `} style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
            {selectedPost !== null
                ? selectedPost.imageUrls.map((item, index) => {
                    return (
                        <div key={index} className="relative flex-shrink-0 w-full h-full">
                            <img
                                src={item}
                                alt="Post"
                                onDoubleClick={() => handleDoubleClick(index)}
                                onTouchStart={() => {
                                    const currentTime = Date.now();
                                    const timeDifference = currentTime - lastTouchTime.current;
                                    if (timeDifference < 300 && timeDifference > 0) {
                                        handleDoubleClick(index)
                                    }
                                    lastTouchTime.current = currentTime;
                                }}
                                className="object-fill h-full w-full"
                            />
                            <LikeAnimation showHeart={showHeart} heartIndex={heartIndex} index={index} />
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