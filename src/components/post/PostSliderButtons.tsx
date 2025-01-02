import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { usePost } from "../../context/PostContext";

interface PostSliderButtonsProps {
    posts: any[];
    currentPost: number;
    handleIncrease: (value: any) => void;
    handleDecrease: (value: any) => void;
    isPostSlider: boolean;
    isHome?: boolean;
    isCaption?: boolean;
}

export const PostSliderButtons: React.FC<PostSliderButtonsProps> = ({
    posts,
    currentPost,
    handleIncrease,
    handleDecrease,
    isPostSlider,
    isHome,
    isCaption
}) => {

    const { selectedPost } = usePost();

    const shouldShowButtons = !isHome ? selectedPost !== null && posts.length > 1 : isCaption ? posts !== undefined && !isCaption && posts.length > 1 : posts !== undefined && posts.length > 1;

    return (
        <>
            {shouldShowButtons && (
                <>
                    {currentPost !== posts.length - 1 && (
                        <button
                            className={`${isPostSlider ? "absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" : `fixed z-[100] right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 xl:block hidden ${selectedPost !== null
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                                }`} `}
                            onClick={handleIncrease}
                        >
                            <FaArrowRight className="fill-black" />
                        </button>
                    )}
                    {currentPost !== 0 && (
                        <button
                            className={`${isPostSlider ? "absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full" : `fixed z-[100] left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full transition-all duration-150 xl:block hidden ${selectedPost !== null ? "opacity-100" : "opacity-0 pointer-events-none"}`}`}
                            onClick={handleDecrease}
                        >
                            <FaArrowLeft className="fill-black" />
                        </button>
                    )}
                </>
            )}
        </>
    );
};
