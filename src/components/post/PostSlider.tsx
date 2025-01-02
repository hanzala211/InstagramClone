import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { usePost } from "../../context/PostContext";
import { useRef, useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { LikeAnimation } from "./LikeAnimation";
import { likePost } from "../../services/post";
import { likePost as likePosts } from "../../services/homePage"
import { PostSliderButtons } from "./PostSliderButtons";
import { useHome } from "../../context/HomeContext";

interface PostSliderProps {
    currentIndex: any;
    setCurrentIndex: (value: any) => void;
    post: any;
    isLiked: any;
    setIsLiked: (value: any) => void;
    index?: number;
    totalIndex?: any[];
    isHome: boolean
}

export const PostSlider: React.FC<PostSliderProps> = ({ currentIndex, setCurrentIndex, post, isLiked, setIsLiked, index, totalIndex, isHome }) => {
    const { selectedPost, setSelectedPost, isAnimating, setIsAnimating } = usePost();
    const { userData, setMessage } = useUser();
    const { homePosts, setHomePosts } = useHome()
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [heartIndex, setHeartIndex] = useState<number>(0);
    const lastTouchTime = useRef<number>(0);

    useEffect(() => {
        return () => {
            lastTouchTime.current = 0;
        };
    }, []);

    function handleIncrease() {
        setIsAnimating(true);
        if (typeof currentIndex === "number") {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setCurrentIndex((prev) => {
                const updated = [...prev];
                updated[index] = updated[index] + 1 < totalIndex[index] ? updated[index] + 1 : updated[index];
                return updated;
            });
        }
        setTimeout(() => setIsAnimating(false), 400);
    };

    function handleDecrease() {
        setIsAnimating(true);
        if (typeof currentIndex === "number") {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex((prev) => {
                const updated = [...prev];
                updated[index] = updated[index] - 1 >= 0 ? updated[index] - 1 : updated[index];
                return updated;
            });
        }
        setTimeout(() => setIsAnimating(false), 400);
    };

    function handleDoubleClick(indexForClick: number) {
        setHeartIndex(indexForClick);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!isLiked && typeof isLiked === "boolean") {
            likePost(setSelectedPost, userData, selectedPost, setIsLiked, setMessage);
        } else if (!isLiked[index]) {
            likePosts(homePosts[index]._id, index, setIsLiked,
                setHomePosts,
                userData,
                setMessage)
        }
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
        <div className={`${isHome ? "w-full bg-[#000000] border-[1px] border-[#2B2B2D] relative overflow-hidden" : "1280:w-[50rem] lg:w-[65rem] md:w-[85rem] w-[100vw] 440:w-[26.9rem] relative overflow-hidden"} `}>
            <div
                className={`w-full relative flex h-full ${isAnimating ? "transition-transform duration-300 ease-in-out" : ""}`}
                style={{ transform: `translateX(${(isHome ? -currentIndex[index] : -currentIndex) * 100}%)` }}
            >
                {post?.imageUrls?.map((item: any, index: number) => (
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

            <PostSliderButtons posts={post?.imageUrls} handleDecrease={handleDecrease} handleIncrease={handleIncrease} currentPost={isHome ? currentIndex[index] : currentIndex} isPostSlider={true} isHome={isHome} />

        </div>
    );
}
