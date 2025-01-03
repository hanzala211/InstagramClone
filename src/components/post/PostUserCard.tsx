import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { MoreSVG } from "../../assets/Constants"
import { UserHoverModal } from "../usermodals/UserHoverModal"
import { PostUserData } from "../../types/postType"
import { UserInfo } from "../../types/user"

interface PostUserCardProps {
    postData: PostUserData | UserInfo;
    setIsHovered: (value: boolean) => void;
    handleClick: (item: any, postData: PostUserData | UserInfo) => void;
    isHovered: boolean;
    setIsPostSettingOpen: (value: boolean) => void;
}

export const PostUserCard: React.FC<PostUserCardProps> = ({ postData, setIsHovered, handleClick, isHovered, setIsPostSettingOpen }) => {
    const { userData } = useUser()
    const navigate = useNavigate()

    return <>
        <HoverCard>
            <HoverCardTrigger>
                <Link
                    to={userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`}
                    onClick={() => handleClick(null, postData)}
                    className="text-[15px] flex flex-row gap-4 items-center font-semibold"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    <img src={postData?.profilePic} alt="Profile Picture" className="w-12 rounded-full" />
                    <p className="hover:opacity-70 transition duration-200">{postData?.userName}</p>
                </Link>
            </HoverCardTrigger>
            <div className="absolute z-[200]" onClick={() => {
                handleClick(null, postData)
                navigate(userData?.data.user._id !== postData?._id ? `/search/${postData?.userName}/` : `/${userData?.data.user.userName}/`)
            }}>
                <HoverCardContent>
                    <UserHoverModal username={postData?.userName} isHovered={isHovered} />
                </HoverCardContent>
            </div>
        </HoverCard>
        <button onClick={() => setIsPostSettingOpen(true)}>
            <MoreSVG className="hover:opacity-70 cursor-pointer transition duration-300" />
        </button>
    </>
}