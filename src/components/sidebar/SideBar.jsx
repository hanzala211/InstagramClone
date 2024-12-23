import { Link, NavLink, useLocation } from "react-router-dom";
import { ActiveChatIcon, ActiveExplore, ActiveHome, ChatIcon, CreateIcon, ExploreIcon, HomeIcon, InstagramSvg, MoreIcon, SearchIcon } from "../../assets/Constants";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSideBar, useUser } from "../../context/UserContext";
import { SearchBox } from "./SearchBox";
import { CreatePost } from "../post/CreatePosts";
import { FaHistory } from "react-icons/fa";
import { CreateStory } from "../story/CreateStory";
import { SideBarItems } from "./SideBarItems";
import { LogOutDiv } from "../profile/LogOutDiv";
import { useSearch } from "../../context/SearchContext";

export function SideBar() {
    const { isSearching, setIsSearching, isCreating, setIsCreating, createStory, setCreateStory } = useSideBar();
    const { setSearchQuery, setSearchData } = useSearch();
    const { userData } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const checkref = useRef(null);
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);
    const dropdownRef = useRef(null);
    const location = useLocation();


    useEffect(() => {
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);


    const sideBarItems = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            activeIcon: <ActiveHome />,
            to: "/home",
            homeactive: true,
            onClick: undefined
        },
        {
            text: "Search",
            icon: <SearchIcon />,
            onClick: () => setIsSearching(prev => !prev),
            ref: searchRef,
        },
        {
            text: "Explore",
            icon: <ExploreIcon />,
            activeIcon: <ActiveExplore />,
            homeactive: true,
            to: "/explore"
        },
        {
            text: "Message",
            icon: <ChatIcon />,
            activeIcon: <ActiveChatIcon />,
            homeactive: true,
            to: "/direct/inbox/",
            isNotification: true,
        },
        {
            text: "Post",
            icon: <CreateIcon />,
            onClick: () => setIsCreating(true),
        },
        {
            text: "Story",
            icon: <FaHistory />,
            onClick: () => setCreateStory(true),
        },
        {
            text: "Profile",
            isImg: true,
            profileImg: userData.data.user.profilePic,
            to: `/${userData.data.user.userName}/`
        }
    ]

    function handleClick(e) {
        if (checkref.current && dropdownRef.current && !checkref.current.contains(e.target) && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
        if (searchRef.current && searchBoxRef.current && !searchRef.current.contains(e.target) && !searchBoxRef.current.contains(e.target)) {
            setIsSearching(false);
            setSearchQuery("");
            setSearchData([]);
        }
    }

    return (
        <>
            <aside className={`px-4 py-10 hidden md:block transition-[width] bg-[#000] border-r-[2px] border-[#262626] duration-300 ease-in-out ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "w-[5rem]" : "w-[5rem] lg:w-[15rem] xl:w-[18rem]"} fixed z-[100] left-0 top-0 h-[100vh]`}>
                <Link to="/home">
                    <img src="/images/instagramiconswhite.png" alt="Instagram Logo" className={`w-[6.5rem] ml-2 mb-9 ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "hidden" : "hidden lg:block"}`} />
                </Link>
                <NavLink to="/home" className={({ isActive }) => `group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-block py-2 px-2 rounded-md mb-4 ${isActive ? "font-bold" : ""} ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "" : "block lg:hidden"}`}>
                    <InstagramSvg className="group-hover:scale-110 transition-transform duration-150" />
                </NavLink>
                <div className="flex flex-col gap-3">
                    {sideBarItems.map((item, i) => (
                        <SideBarItems item={item} key={i} isSearching={isSearching} />
                    ))}
                </div>
                <div ref={checkref} className={`gap-4 absolute bottom-5 group hover:bg-[rgba(255,255,255,.1)] transition cursor-pointer duration-300 inline-flex items-center p-2 rounded-md ${isOpen ? "font-bold" : ""} ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "w-10" : "xl:w-[14rem] w-[50%] lg:w-[12rem]"}`} onClick={() => setIsOpen(prev => !prev)}>
                    <MoreIcon className="group-hover:scale-110 transition-transform duration-150" />
                    <p className={`text-[15px] ${isSearching || location.pathname.slice(0, 7) === "/direct" ? "hidden" : "hidden lg:block"}`}>More</p>
                </div>
                <SearchBox refere={searchBoxRef} isSearching={isSearching} />
            </aside>
            <div>
                <LogOutDiv isOpen={isOpen} dropdownRef={dropdownRef} />
            </div>
            <CreatePost isCreating={isCreating} setIsCreating={setIsCreating} />
            <CreateStory creatingStory={createStory} setIsCreatingStory={setCreateStory} />
        </>
    );
}
