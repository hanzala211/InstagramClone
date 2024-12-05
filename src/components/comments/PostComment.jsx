export function PostComment({ commentRef, commentValue, setCommentValue, isDisabled, postComment }) {
    return <div className="mt-5 border-t-[1px] flex items-center border-[#262626] px-5 py-2">
        <input
            ref={commentRef}
            type="text"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder="Add a comment...."
            className="w-[90%] bg-transparent outline-none placeholder:text-[14px]"
        />
        <button
            className={`text-[#0095F6] ml-5 text-[12px] transition-all duration-150 ${isDisabled ? "opacity-50 " : "cursor-pointer hover:opacity-70"}`}
            disabled={isDisabled}
            onClick={postComment}
        >
            POST
        </button>
    </div>
}