import { useEffect } from "react";
import { usePost } from "../../context/PostContext";
import { useUser } from "../../context/UserContext";

export function PostComment({ commentRef, className, item }) {
    const { setIsDisabled, isDisabled, commentValue, setCommentValue, setIsCommented, selectedPost, setSelectedPost } = usePost()
    const { userData, setMessage } = useUser()

    async function postComment() {
        try {
            setIsDisabled(true);
            const respone = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/comment/${selectedPost._id}`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "comment": commentValue
                }),
                redirect: "follow"
            })
            const result = await respone.json();
            if (result.status !== "fail") {
                setMessage("Commented Successfully")
                setCommentValue("")
                setIsCommented((prev) => !prev)
            }
        } catch (error) {
            console.error(error)
            setMessage("Failed")
        } finally {
            setIsDisabled(commentValue.length === 0);
        }
    }

    useEffect(() => {
        if (commentValue.length > 0) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true);
        }
    }, [commentValue])

    return <div className={`mt-5 border-t-[1px] flex items-center border-[#262626] px-5 py-2 ${className}`}>
        <input
            ref={commentRef}
            type="text"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder="Add a comment...."
            className="w-[90%] bg-transparent outline-none placeholder:text-[14px]"
            onFocus={() => {
                if (selectedPost === null) {
                    setSelectedPost(item)
                }
            }}
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