import { Link } from "react-router-dom"
import { UserInfo } from "../../types/user"
import { useAuth } from "../../context/AuthContext";
import { getDataOnClick } from "../../services/searchProfile";

interface UserModalProps {
    setSelectedProfile: (value: UserInfo) => void;
    item: UserInfo;
    isSearchModal: boolean
}

export const UserModal: React.FC<UserModalProps> = ({ setSelectedProfile, item, isSearchModal }) => {
    const { setMainLoading, token } = useAuth()

    const fetchUserDataOnClick = async () => {
        try {
            setMainLoading(true);
            const res = await getDataOnClick({
                username: item?.userName,
                token
            })
            setSelectedProfile(res.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setMainLoading(false);
            }, 1000);
        }
    }

    return <Link to={`/search/${item.userName}/`} onClick={() => {
        if (isSearchModal) {
            setSelectedProfile(item)
        }
        else {
            setMainLoading(true);
            fetchUserDataOnClick()
        }
    }} className="flex items-center gap-3 px-3 hover:bg-[#626262] hover:bg-opacity-50 py-2 transition-all duration-300">
        <img src={item.profilePic} alt="ProfileImage" className="w-10 rounded-full" />
        <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-semibold">{item.userName}</p>
            <p className="text-[#A8A8A8] text-[12px]">{item.fullName}</p>
        </div>
    </Link>
}