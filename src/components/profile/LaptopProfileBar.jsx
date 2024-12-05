import { NavLink } from "react-router-dom";
import { PostsIcon, SavedIcon, TaggedUser } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";

export function LaptopProfileBar() {
    const { userData } = useUser()
    return <>
        <div className="absolute hidden xl:left-[57%] left-[60%] -translate-x-1/2 md:flex flex-row gap-10 mt-0">
            <NavLink end to={`/${userData?.data?.user.userName || userData.data.userName}/`} className={({ isActive }) => `flex items-center tracking-wider py-3 gap-1 text-[12px] ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}>
                <PostsIcon /> POSTS
            </NavLink>
            <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/saved/`} className={({ isActive }) => `flex items-center tracking-wider py-3 text-[12px] gap-1 ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}>
                <SavedIcon /> SAVED
            </NavLink>
            <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/tagged/`} className={({ isActive }) => `flex items-center tracking-wider py-3 text-[12px] gap-1 ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}>
                <TaggedUser /> TAGGED
            </NavLink>
        </div>
    </>
}   