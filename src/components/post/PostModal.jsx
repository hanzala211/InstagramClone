import { FaHeart } from "react-icons/fa";
import { PiCopySimpleLight } from "react-icons/pi";
import { TbMessageCircleFilled } from "react-icons/tb";
import { formatNumber } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

export function PostModal({ arr, i, setSelectedPost, setIsPostOpen, setCurrentPost, item }) {
    const { userData } = useUser()
    const [innerHeight, setInnerHeight] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        setInnerHeight(window.innerWidth)
    }, [window.innerWidth])

    return <div className="w-full max-w-[25rem] h-full max-h-[25rem] cursor-pointer group relative overflow-hidden" onClick={() => {
        if (innerHeight > 768) {
            setIsPostOpen(true)
            setCurrentPost(i);
        } else {
            navigate(`/${item?.user ? item.user.userName : item.postBy.userName ? item.postBy.userName : userData?.data?.user?.userName}/p/${item._id}/`)
        }
        setSelectedPost({
            ...arr[i],
            user: {
                userName: item.postBy.userName ? item.postBy.userName : item.user ? item.user.userName : userData.data.user.userName,
                profilePic: item.postBy.profilePic ? item.postBy.profilePic : item.user ? item.user.profilePic : userData.data.user.profilePic,
                _id: item.postBy._id ? item.postBy._id : item.user ? item.user._id : userData.data.user._id
            }
        }
        );
    }}>
        <div className="absolute md:right-3 md:top-2 right-1 top-1">
            {item?.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[18px] md:text-[25px]" /> : ""}
        </div>
        <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item?.likeCount)}</p>
            <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item?.commentsCount)}</p>
        </div>
        <img
            src={item?.imageUrls[0]}
            alt={item?.caption}
            className="w-full h-full object-cover object-center"
        />
    </div>
}