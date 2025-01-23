import { usePost } from "../../context/PostContext";
import { useRef, useState, useEffect } from "react";
import { LikeAnimation } from "./LikeAnimation";
import { useHome } from "../../context/HomeContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

interface PostSliderProps {
    post: any;
    isLiked: any;
    index?: number;
    isHome: boolean
}

export const PostSlider: React.FC<PostSliderProps> = ({ post, isLiked, index, isHome }) => {
    const { likePost } = usePost();
    const { homePosts, setHomePosts, likeHomePost } = useHome()
    const [showHeart, setShowHeart] = useState<boolean>(false);
    const [heartIndex, setHeartIndex] = useState<number>(0);
    const lastTouchTime = useRef<number>(0);

    useEffect(() => {
        return () => {
            lastTouchTime.current = 0;
        };
    }, []);

    function handleDoubleClick(indexForClick: number) {
        setHeartIndex(indexForClick);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
        if (!isLiked && typeof isLiked === "boolean") {
            likePost();
        } else if (!isLiked[index || 0]) {
            likeHomePost(homePosts[index || 0]._id, index || 0)
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
            <Carousel>
                <CarouselContent className={`relative ${isHome ? "h-full" : "lg:h-[67vh] md:h-[61vh] 1280:h-[87vh] h-auto"} flex`}>
                    {post?.imageUrls?.map((item: any, index: number) => (
                        <CarouselItem key={index} className="relative flex-shrink-0 w-full h-full">
                            <img
                                src={item}
                                alt="Post"
                                onDoubleClick={() => handleDoubleClick(index)}
                                onTouchStart={() => handleTouchStart(index)}
                                className="object-fill h-full w-full"
                            />
                            <LikeAnimation showHeart={showHeart} heartIndex={heartIndex} index={index} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {post?.imageUrls.length > 1 && <>
                    <CarouselNext isHomeStories={false} />
                    <CarouselPrevious isHomeStories={false} />
                </>
                }
            </Carousel>
        </div>
    );
}
