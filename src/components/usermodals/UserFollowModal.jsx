import { useSearch, useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { UserModal } from "./UserModal";
import { Skeleton } from "../helpers/Skeleton";
import { Overlay } from "../helpers/Overlay";
import { fetchFollowers, fetchFollowing } from "../../services/followerModal";

export function UserFollowModal({ isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen }) {
    const { userData, userFollowers, setUserFollowers, userFollowing, setUserFollowing } = useUser();
    const { setSelectedProfile } = useSearch();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isFollowerModalOpen ? "hidden" : "auto";

        return () => body.style.overflowY = "auto"
    }, [isFollowerModalOpen])


    useEffect(() => {
        if (isFollowerModalOpen === true) {
            fetchFollowers(setIsLoading, userData, setUserFollowers);
        }
        else if (isFollowingModalOpen) {
            fetchFollowing(setIsLoading, userData, setUserFollowing);
        }
    }, [isFollowerModalOpen, isFollowingModalOpen])

    function handleClose() {
        if (isFollowerModalOpen) {
            setIsFollowerModalOpen(false);
            setTimeout(() => {
                setUserFollowers([])
            }, 900)
        } else if (isFollowingModalOpen) {
            setTimeout(() => {
                setUserFollowing([]);
            }, 900)
            setIsFollowingModalOpen(false)
        }
    }

    return <>
        <Overlay handleClose={handleClose} isPostOpen={isFollowerModalOpen || isFollowingModalOpen} />
        <div className={`fixed opacity-0 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isFollowerModalOpen || isFollowingModalOpen ? "opacity-100" : "pointer-events-none"} w-full max-w-[20rem] rounded-xl border-y-[1px] bg-[#363636] border-[#363636]`}>
            <div className="border-b-[1px] border-[#252525] h-[2rem]">
                <h1 className="absolute left-1/2 top-1 text-[14px] -translate-x-1/2">User {isFollowerModalOpen ? "Followers" : "Following"} </h1>
            </div>
            <div className="overflow-auto scrollbar-hidden h-[20rem]">
                {isLoading ? Array.from(({ length: 15 }), (_, i) => <div key={i} className="ml-3 mt-5"><Skeleton /></div>) : isFollowerModalOpen ? userFollowers.map((item, i) => (
                    <UserModal key={i} index={i} item={item} isSearchModal={false} setSelectedProfile={setSelectedProfile} />
                )) : isFollowingModalOpen ? userFollowing.map((item, i) => (
                    <UserModal key={i} index={i} item={item} isSearchModal={false} setSelectedProfile={setSelectedProfile} />
                )) : ""}
            </div>
        </div>
    </>
}