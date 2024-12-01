import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { FullSkeleton } from "./FullSkeleton";
import { formatNumber } from "../utils/helper";

export function UserHoverModal({ username, isHovered }) {
    const { userData } = useUser()
    const [hoverProfile, setHoverProfile] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const abortController = new AbortController();
        if (isHovered) {
            setIsLoading(true)
            fetchUserDataOnHover(abortController.signal)
        }
        return () => {
            abortController.abort();
        }
    }, [])

    async function fetchUserDataOnHover(signal) {
        try {
            const response = await fetch(
                `https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${username}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `${userData?.data.token}`,
                    },
                    redirect: 'follow',
                    signal
                }
            );
            const result = await response.json();
            setHoverProfile(result.data[0]);
            if (result.data[0].posts) {
                await Promise.all(
                    result.data[0]?.posts.slice(0, 3).map((item) => fetchPostData(item))
                )
                    .then((res) => setPosts((prev) => [...prev, ...res.map((item) => item.post)]))
                    .catch((err) => console.error(err))
                    .finally(() => setIsLoading(false))
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching user' + error)
            }
        }
    }

    async function fetchPostData(id) {
        try {
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `${userData?.data.token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error)
        }
    }

    return <div className="bg-[#000] container w-[20rem] rounded-lg shadow-sm shadow-gray-200 h-[16rem] ">
        {isLoading ? <FullSkeleton /> :
            <>
                <div className="flex gap-5 px-5 py-2">
                    <img src={hoverProfile?.profilePic} alt="Test User" className="rounded-full w-12 h-12" />
                    <div className="flex gap-1 flex-col">
                        <Link className="text-[14px]">{hoverProfile?.userName}</Link>
                        <p className="text-[#a8a8a8] text-[12px]">{hoverProfile?.fullName}</p>
                    </div>
                </div>
                <div className="flex justify-evenly gap-5 mt-3">
                    <p className="font-bold flex flex-col items-center text-[15px]">{formatNumber(hoverProfile?.postCount)} <span className="font-normal">posts</span></p>
                    <p className="font-bold flex flex-col items-center text-[15px]">{formatNumber(hoverProfile?.followersCount)} <span className="font-normal">followers</span></p>
                    <p className="font-bold flex flex-col items-center text-[15px]">{formatNumber(hoverProfile?.followingCount)} <span className="font-normal">following</span></p>
                </div>
                <div className={`flex mt-6 gap-1 ${posts.length > 2 ? "justify-evenly" : ""}`}>
                    {posts?.map((item, i) => (
                        <img key={i} src={item?.imageUrls[0]} alt={item?.caption} className="w-[6.3rem] h-28 object-cover border-[1px] border-gray-300 rounded" />
                    ))}
                </div>
            </>
        }
    </div>
}