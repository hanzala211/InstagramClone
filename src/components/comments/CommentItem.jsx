import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { Link, useNavigate } from "react-router-dom"
import { UserHoverModal } from "../usermodals/UserHoverModal"
import { formatDate } from "../../utils/helper"
import { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext"

export function CommentItem({ item, comments, handleClick, i }) {
    const { userData } = useUser()
    const [isCommentHovered, setIsCommentHovered] = useState(Array(comments?.length).fill(false))
    const navigate = useNavigate()

    useEffect(() => {
        if (comments?.length > 0) {
            setIsCommentHovered(Array(comments?.length).fill(false))
        }
    }, [comments?.length])

    const handleMouseEnterForComments = (i) => {
        setIsCommentHovered((prev) => {
            const updated = [...prev]
            updated[i] = true;
            return updated;
        });
    };

    const handleMouseLeaveForComments = (i) => {
        setIsCommentHovered((prev) => {
            const updated = [...prev]
            updated[i] = false;
            return updated;
        })
    };

    return <div className="flex gap-4 ml-1">
        <img src={item?.user?.profilePic} alt={item?.user?.userName} className="w-9 h-9 rounded-full" />
        <HoverCard>
            <div className="flex flex-col gap-1 relative">
                <p className="text-[15px]">
                    <HoverCardTrigger>
                        <Link
                            to={userData?.data.user._id !== item?.user?._id ? `/search/${item?.user?.userName}/` : `/${userData?.data.user.userName}/`}
                            onClick={() => handleClick(item)}
                            className="text-[13px] mr-2 font-semibold hover:opacity-50 transition duration-150"
                            onMouseEnter={() => handleMouseEnterForComments(i)}
                            onMouseLeave={() => handleMouseLeaveForComments(i)}
                        >
                            {item?.user?.userName}
                        </Link>
                    </HoverCardTrigger>
                    {item?.comment}
                </p>
                <div className="absolute z-[200]" onClick={() => {
                    handleClick(item)
                    navigate(userData?.data.user._id !== item?.user._id
                        ? `/search/${item?.user.userName}/`
                        : `/${userData?.data?.user?.userName}/`)
                }}>
                    <HoverCardContent>
                        <UserHoverModal username={item?.user?.userName} isHovered={isCommentHovered[i]} />
                    </HoverCardContent>
                </div>
                <p className="text-[12px] text-[#A8A8A8]">{formatDate(item?.createdAt)}</p>
            </div>
        </HoverCard>
    </div>
}