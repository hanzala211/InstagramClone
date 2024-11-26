import { FaHeart } from "react-icons/fa";
import { PiCopySimpleLight } from "react-icons/pi";
import { TbMessageCircleFilled } from "react-icons/tb";
import { formatNumber } from "../utils/helper";

export function PostModal({ arr, i, setSelectedPost, setIsPostOpen, setCurrentPost, item }) {

    return <div className="w-full max-w-[25rem] h-full max-h-[25rem] cursor-pointer group relative overflow-hidden" onClick={() => {
        setSelectedPost(arr[i]);
        setIsPostOpen(true)
        setCurrentPost(i);
    }}>
        <div className="absolute right-3 top-2">
            {item.imageUrls.length > 1 ? <PiCopySimpleLight className="text-[25px]" /> : ""}
        </div>
        <div className="absolute z-10 flex items-center justify-center gap-2 w-full h-full opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <p className="text-[17px] font-semibold flex items-center gap-2"><FaHeart /> {formatNumber(item.likeCount)}</p>
            <p className="text-[17px] font-semibold flex items-center gap-2"><TbMessageCircleFilled />{formatNumber(item.commentsCount)}</p>
        </div>
        <img
            src={item.imageUrls[0]}
            alt={item.caption}
            className="w-full h-full object-cover object-center"
        />
    </div>
}