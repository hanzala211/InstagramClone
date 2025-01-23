import { FaHeart } from "react-icons/fa";
import { PiCopySimpleLight } from "react-icons/pi";
import { TbMessageCircleFilled } from "react-icons/tb";
import { formatNumber } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Post } from "../../types/postType";
import { useAuth } from "../../context/AuthContext";

interface PostModalProps {
    arr: Post[];
    i: number;
    setSelectedPost: (value: Post) => void;
    setIsPostOpen: (value: boolean) => void;
    setCurrentPost: (value: number | null) => void;
    item: any;
}

export const PostModal: React.FC<PostModalProps> = ({ arr, i, setSelectedPost, setIsPostOpen, setCurrentPost, item }) => {
    const { innerWidth } = useUser()
    const { userData } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        if (innerWidth > 770) {
            setIsPostOpen(true)
            setCurrentPost(i);
        } else {
            navigate(`/${item?.user ? item.user.userName : item.postBy.userName ? item.postBy.userName : userData?.data?.user?.userName}/p/${item._id}/`)
        }
        setSelectedPost({
            ...arr[i],
            user: {
                userName: item.postBy?.userName || item.user?.userName || userData.data.user.userName,
                profilePic: item.postBy?.profilePic || item.user?.profilePic || userData.data.user.profilePic,
                _id: item.postBy?._id || item.user?._id || userData.data.user._id,
            }
        });
    }

    return <div className="w-full max-w-[35rem] h-full max-h-[35rem] cursor-pointer group relative overflow-hidden" onClick={handleClick}>
        <div className="absolute md:right-3 md:top-2 right-1 top-1">
            {item?.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[18px] md:text-[25px]" /> : ""}
        </div>
        <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item?.likeCount)}</p>
            <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item?.commentsCount)}</p>
        </div>
        <img
            src={item?.imageUrls[0]}
            alt={item?.caption || undefined}
            className="w-full h-full object-cover object-center"
        />
    </div>
}