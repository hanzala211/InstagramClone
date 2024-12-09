import { NavLink, useLocation } from "react-router-dom";

export function SideBarItems({ item, isSearching }) {
    const location = useLocation()
    return <NavLink
        to={item.onClick === undefined && item.to}
        ref={item.ref}
        className={({ isActive }) =>
            `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 rounded-md ${isActive ? item.text === "Home" || item.text === "Profile" || item.text === "Explore" ? "font-bold" : "" : ""} ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "w-[90%] lg:w-10" : "w-[90%]"} ${isSearching && item.text === "Search" ? "border-[1px]" : ""}`
        }
        onClick={item?.onClick}
    >
        {({ isActive }) => (
            <><span className="text-[22px]">
                {item?.isImg ? (
                    <img
                        src={item?.profileImg}
                        id="image"
                        alt="userIcon"
                        className={`rounded-full w-[1.5rem] h-[1.5rem] group-hover:scale-110 max-w-[1.5rem] ${isActive ? "border-[2px]" : ""}`}
                    />
                ) : item?.homeactive ? isActive && !isSearching ? item?.activeIcon : item.icon : item.icon}
            </span>
                <p className={`text-[15px] ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "hidden" : "hidden lg:block"}`}>{item?.text}</p>
            </>
        )}
    </NavLink >
}