import { usePost } from "../../context/PostContext";
import { Skeleton } from "../helpers/Skeleton";
import { CommentItem } from "./CommentItem";

export function CommentsStructure({ handleClick }) {
    const { comments, commentsLoading } = usePost()
    return <>
        {commentsLoading ? (
            <div className="flex flex-col gap-4">{Array.from({ length: 20 }, (_, i) => <Skeleton key={i} />)}</div>
        ) : (
            comments?.map((item, i) => (
                <CommentItem key={i} item={item} comments={comments} handleClick={handleClick} i={i} />
            ))
        )}
    </>
}