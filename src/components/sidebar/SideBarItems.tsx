import { NavLink, useLocation } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { SideBarItemsType } from "../../types/sideBarTypes";

interface SideBarItemsProps {
    item: any;
    isSearching?: boolean
}

export const SideBarItems: React.FC<SideBarItemsProps> = ({ item, isSearching }) => {
    const { notifications } = useChat();
    const location = useLocation();

    const isActiveClass = (isActive: any) => {
        if (isActive) {
            if (["Home", "Profile", "Explore"].includes(item.text)) {
                return "font-bold";
            }
        }
        return;
    };

    return (
        <NavLink
            to={item.onClick === undefined && item.to}
            ref={item.ref}
            className={({ isActive }) =>
                `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 rounded-md
                ${isActiveClass(isActive)} ${isSearching || location.pathname.startsWith("/direct")
                    ? "w-[90%] lg:w-10"
                    : "w-[90%]"} ${isSearching && item.text === "Search" ? "border-[1px]" : ""}`
            }
            onClick={item?.onClick}
        >
            {({ isActive }) => (
                <>
                    <span className="text-[22px] relative">
                        {notifications.length > 0 && item.isNotification && (
                            <div className="absolute w-4 h-4 border-[1px] border-black text-white bg-red-600 rounded-full text-[10px] text-center -right-1 -top-1">
                                {notifications.length}
                            </div>
                        )}
                        {item?.isImg ? (
                            <img
                                src={item?.profileImg}
                                alt="userIcon"
                                className={`rounded-full w-[1.5rem] h-[1.5rem] group-hover:scale-110 max-w-[1.5rem] 
                                    ${isActive ? "border-[2px]" : ""}`}
                            />
                        ) : item?.homeactive ? (
                            isActive && !isSearching ? item?.activeIcon : item.icon
                        ) : (
                            item.icon
                        )}
                    </span>
                    <p className={`text-[15px] ${isSearching || location.pathname.startsWith("/direct") ? "hidden" : "hidden lg:block"}`}>
                        {item?.text}
                    </p>
                </>
            )}
        </NavLink>
    );
}
