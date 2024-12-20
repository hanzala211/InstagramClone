import { NavLink } from "react-router-dom";
import { MobilePostIcon, MobileSaveIcon, MobileTagIcon } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";

export function MobileProfileBar() {
    const { userData } = useUser();
    return <div className="md:hidden flex border-b-[1px] border-[#262626] flex-row justify-evenly gap-10 mt-0">
        <NavLink end to={`/${userData?.data?.user.userName || userData.data.userName}/`} className={({ isActive }) => `flex items-center ml-5 tracking-wider py-3 gap-1 w-[33%] justify-center text-[12px] ${isActive ? "font-semibold  border-t-[1px]" : "text-[##A8A8A8]"}`}>
            <MobilePostIcon />
        </NavLink>
        <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/saved/`} className={({ isActive }) => `flex items-center tracking-wider py-3 w-[33%] justify-center text-[12px] gap-1 ${isActive ? "font-semibold border-t-[1px]" : "text-[##A8A8A8]"}`}>
            <MobileSaveIcon />
        </NavLink>
        <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/tagged/`} className={({ isActive }) => `flex items-center mr-5 tracking-wider py-3 w-[33%] justify-center text-[12px] gap-1 ${isActive ? "font-semibold  border-t-[1px]" : "text-[##A8A8A8]"}`}>
            <MobileTagIcon />
        </NavLink>
    </div>
}