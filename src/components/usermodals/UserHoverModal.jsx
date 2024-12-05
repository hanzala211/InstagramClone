import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { FullSkeleton } from "../helpers/FullSkeleton";
import { fetchUserDataOnHover, formatNumber } from "../../utils/helper";

export function UserHoverModal({ username, isHovered }) {
    const { userData } = useUser()
    const [hoverProfile, setHoverProfile] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const abortController = new AbortController();
        if (isHovered) {
            setIsLoading(true)
            fetchUserDataOnHover(abortController.signal, username, userData, setHoverProfile, setPosts, setIsLoading)
        }
        return () => {
            abortController.abort();
        }
    }, [])

    return <div className="bg-[#000] w-[20rem] rounded-lg shadow-sm shadow-gray-200 h-[16rem] hidden md:block">
        {isLoading ? <FullSkeleton /> :
            <>
                <div className="flex gap-5 px-3 py-2">
                    <img src={hoverProfile?.profilePic} alt="Test User" className="rounded-full w-11 h-11" />
                    <div className="flex gap-1 flex-col">
                        <Link className="text-[14px]">{hoverProfile?.userName}</Link>
                        <p className="text-[#a8a8a8] text-[12px]">{hoverProfile?.fullName}</p>
                    </div>
                </div>
                <div className="flex justify-evenly mt-3">
                    <p className="font-bold flex flex-col ml-3 items-center text-[15px]">{formatNumber(hoverProfile?.postCount)} <span className="font-normal">posts</span></p>
                    <p className="font-bold flex flex-col items-center ml-10 text-[15px]">{formatNumber(hoverProfile?.followersCount)} <span className="font-normal">followers</span></p>
                    <p className="font-bold flex flex-col items-center text-[15px] ml-8">{formatNumber(hoverProfile?.followingCount)} <span className="font-normal">following</span></p>
                </div>
                <div className={`flex mt-9 gap-1 ${posts.length > 2 ? "justify-evenly" : ""}`}>
                    {posts.length > 0 ? posts?.map((item, i) => (
                        <img key={i} src={item?.imageUrls[0]} alt={item?.caption} className="w-[32%] object-cover rounded" />
                    )) : <div className="flex flex-col gap-2 items-center">
                        <img src="/images/icons.png" className="w-10" />
                        <h1 className="text-[20px]">No Posts</h1>
                    </div>}
                </div>
            </>
        }
    </div>
}