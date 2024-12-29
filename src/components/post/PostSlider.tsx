import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { usePost } from "../../context/PostContext";
import { useRef, useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { LikeAnimation } from "./LikeAnimation";
import { likePost } from "../../services/post";

interface PostSliderProps{
    currentIndex: number;
    setCurrentIndex: (value: number) => void
}

export const PostSlider: React.FC<PostSliderProps> = ({ currentIndex, setCurrentIndex }) => {
    const { isAnimating, selectedPost, setSelectedPost, isLiked, setIsLiked, setIsAnimating } = usePost();
    const { userData, setMessage } = useUser();
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [heartIndex, setHeartIndex] = useState<number>(0);
    const lastTouchTime = useRef<number>(0);

    useEffect(() => {
        return () => {
            lastTouchTime.current = 0;
        };
    }, []);

    function handleDoubleClick(index: number) {
        setHeartIndex(index);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!isLiked) {
            likePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage);
        }
    };

    function handleIncrease() {
        setIsAnimating(true);
        setCurrentIndex((prev: number) => prev + 1);
        setTimeout(() => setIsAnimating(false), 400);
    };

    function handleDecrease() {
        setIsAnimating(true);
        setCurrentIndex(prev => prev - 1);
        setTimeout(() => setIsAnimating(false), 400);
    };

    function handleTouchStart(index: number) {
        const currentTime = Date.now();
        const timeDifference = currentTime - lastTouchTime.current;
        if (timeDifference < 300 && timeDifference > 0) {
            handleDoubleClick(index);
        }
        lastTouchTime.current = currentTime;
    };

    return (
        <div className="1280:w-[50rem] lg:w-[65rem] md:w-[85rem] w-[100vw] 440:w-[26.9rem] relative overflow-hidden">
            <div
                className={`w-full relative flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""}`}
                style={{ transform: `translateX(${-currentIndex * 100}%)` }}
            >
                {selectedPost?.imageUrls?.map((item, index) => (
                    <div key={index} className="relative flex-shrink-0 w-full h-full">
                        <img
                            src={item}
                            alt="Post"
                            onDoubleClick={() => handleDoubleClick(index)}
                            onTouchStart={() => handleTouchStart(index)}
                            className="object-fill h-full w-full"
                        />
                        <LikeAnimation showHeart={showHeart} heartIndex={heartIndex} index={index} />
                    </div>
                ))}
            </div>

            {selectedPost?.imageUrls.length > 1 && (
                <>
                    {currentIndex !== selectedPost.imageUrls.length - 1 && (
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
            )}
        </div>
    );
}
