import { CommentSVG } from "../../assets/Constants";
import { usePost } from "../../context/PostContext";
import { LikedComponent } from "./LikeComponent";
import { SavedComponent } from "./SavedComponent";

export function PostOptions({ postData, commentRef }) {
    const { selectedPost, setSelectedPost } = usePost()

    return <div className="flex justify-between pt-5 px-5 ">
        <div className="flex flex-row gap-5">
            <LikedComponent postData={postData} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
            <button onClick={() => commentRef.current.focus()}>
                <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
            </button>
        </div>
        <SavedComponent />
    </div>
}