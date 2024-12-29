import { useSearch } from "../../context/SearchContext";
import { useUser } from "../../context/UserContext";
import { formatNumber } from "../../utils/helper";

export const UserFollowDetails = ({ isSearchProfile }: { isSearchProfile: boolean }) => {
    const { setIsFollowerModalOpen, setIsFollowingModalOpen, userData } = useUser();
    const { selectedProfile } = useSearch()

    return <>
        <p className="flex md:flex-row md:gap-1.5 flex-col items-center md:items-start gap-0.5 w-[33%] md:w-auto"><span className="font-semibold">{formatNumber(!isSearchProfile ? userData.data.user.postCount : selectedProfile.postCount)}</span><span className="text-[13px] text-[#a8a8a8] md:text-[16px] md:text-white">posts</span></p>
        <button onClick={() => {
            if (!isSearchProfile) {
                setIsFollowerModalOpen(true)
            }
        }} className="flex md:flex-row md:gap-1.5 flex-col items-center md:items-start gap-0.5 w-[33%] md:w-auto"><span className="font-semibold">{formatNumber(!isSearchProfile ? userData.data.user.followersCount : selectedProfile.followersCount)}</span><span className="text-[13px] text-[#a8a8a8] md:text-[16px] md:text-white">followers</span></button>
        <button onClick={() => {
            if (!isSearchProfile) {
                setIsFollowingModalOpen(true)
            }
        }} className="flex md:flex-row md:gap-1.5 flex-col items-center md:items-start gap-0.5 w-[33%] md:w-auto"><span className="font-semibold">{formatNumber(!isSearchProfile ? userData.data.user.followingCount : selectedProfile.followingCount)}</span><span className="text-[13px] text-[#a8a8a8] md:text-[16px] md:text-white">following</span></button>
    </>
}