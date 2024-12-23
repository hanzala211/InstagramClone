import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export const ProfileNavLink = ({ icon: Icon, label, to, isMyProfile }) => {
    const { innerWidth } = useUser();

    return (
        <div
            className={`${isMyProfile
                ? "flex gap-0"
                : innerWidth < 770
                    ? "flex md:hidden justify-center border-b-[1px] border-[#262626] gap-10"
                    : "absolute left-[58%] xl:left-[55.5%] -translate-x-1/2 md:flex hidden gap-10"
                }`}
        >
            <NavLink
                end
                to={to}
                className={({ isActive }) =>
                    `flex items-center tracking-wider py-3 ${isMyProfile ? "px-5" : "px-10"} gap-1 text-[14px] ${isActive ? "font-semibold border-t-[2px]" : "text-[#A8A8A8]"}`
                }
            >
                <Icon />
                {label}
            </NavLink>
        </div>
    );
};
