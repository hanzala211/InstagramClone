import { FaHistory } from "react-icons/fa"
import { ActiveExplore, ActiveHome, CreateIcon, ExploreIcon, HomeIcon } from "../../assets/Constants"
import { useSideBar, useUser } from "../../context/UserContext"
import { NavLink } from "react-router-dom"

export function MobileBar() {
    const { setIsCreating, setCreateStory } = useSideBar()
    const { userData } = useUser()

    const sideBarItems = [
        {
            icon: <HomeIcon />,
            activeIcon: <ActiveHome />,
            to: "/home",
            homeactive: true,
            onClick: undefined
        }, {
            icon: <ExploreIcon />,
            activeIcon: <ActiveExplore />,
            homeactive: true,
            to: "/explore"
        }, {
            icon: <CreateIcon />,
            onClick: () => setIsCreating(true),
        }, {
            icon: <FaHistory />,
            onClick: () => setCreateStory(true),
        }, {
            isImg: true,
            profileImg: userData.data.user.profilePic,
            to: `/${userData.data.user.userName}/`
        }
    ]
    return <div className="fixed block md:hidden bottom-0 z-[10000] bg-[#000] w-full h-[3.5rem] pt-1 border-t-[2px] border-[#323232]">
        <div className="flex items-center justify-around">
            {sideBarItems.map((item, i) => (
                <NavLink
                    to={item.onClick === undefined && item.to}
                    ref={item.ref}
                    className={({ isActive }) =>
                        `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 rounded-md ${isActive ? "font-bold" : ""}`
                    }
                    onClick={item?.onClick}
                    key={i}
                >
                    {({ isActive }) => (
                        <span className="text-[22px]">
                            {item?.isImg ? (
                                <img
                                    src={item?.profileImg}
                                    id="image"
                                    alt="userIcon"
                                    className={`rounded-full w-[1.5rem] group-hover:scale-110 ${isActive ? "border-[3px]" : ""}`}
                                />
                            ) : item?.homeactive ? isActive ? item?.activeIcon : item.icon : item.icon}
                        </span>
                    )}
                </NavLink >
            ))}
        </div>
    </div >
}