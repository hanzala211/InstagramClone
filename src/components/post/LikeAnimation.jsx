import { LikePost } from "../../assets/Constants";

export function LikeAnimation({ showHeart, heartIndex, index }) {
    return <>
        {showHeart && heartIndex === index && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-500 text-6xl animate-popAndMoveUp">
                    <LikePost />
                </div>
            </div>
        )}
    </>
}