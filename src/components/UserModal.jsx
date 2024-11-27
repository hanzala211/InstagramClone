import { Link } from "react-router-dom"
import { fetchUserDataOnClick } from "../utils/helper"
import { useUser } from "../context/UserContext"

export function UserModal({ setSelectedProfile, item, isSearchModal }) {
    const { userData, setMainLoading } = useUser()
    return <Link to={`/search/${item.userName}/`} onClick={() => {
        if (isSearchModal) {
            setSelectedProfile(item)
        }
        else {
            setMainLoading(true);
            fetchUserDataOnClick(item?.userName, userData, null, setSelectedProfile, setMainLoading)
        }
    }} className="flex items-center gap-3 px-3 hover:bg-[#626262] hover:bg-opacity-50 py-2 transition-all duration-300">
        <img src={item.profilePic} alt="ProfileImage" className="w-10 rounded-full" />
        <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-semibold">{item.userName}</p>
            <p className="text-[#A8A8A8] text-[12px]">{item.fullName}</p>
        </div>
    </Link>
}