import { Link, NavLink } from "react-router-dom";
import { ActiveExplore, ActiveHome, CreateIcon, ExploreIcon, HomeIcon, InstagramSvg, MoreIcon, ReportIcon, SaveIcon, SearchIcon } from "../assets/Constants";
import { useEffect, useRef, useState } from "react";
import { useSearch, useSideBar, useUser } from "../context/UserContext";
import { SearchBox } from "./SearchBox";
import { CreatePost } from "./CreatePosts";
import { FaHistory } from "react-icons/fa";
import { CreateStory } from "./CreateStory";
import { SideBarItems } from "./SideBarItems";
import { LogOutDiv } from "./LogOutDiv";

export function SideBar() {
    const { isSearching, setIsSearching, isCreating, setIsCreating, createStory, setCreateStory } = useSideBar();
    const { setSearchQuery, setSearchData } = useSearch()
    const { userData } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const checkref = useRef(null);
    const searchRef = useRef(null);
    const fileInputRef = useRef(null);
    const searchBoxRef = useRef(null);
    const dropdownRef = useRef(null);

    const sideBarItems = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            activeIcon: <ActiveHome />,
            to: "/home",
            homeactive: true,
            onClick: undefined
        }, {
            text: "Search",
            icon: <SearchIcon />,
            onClick: () => setIsSearching((prev) => !prev),
            ref: searchRef,
        }, {
            text: "Explore",
            icon: <ExploreIcon />,
            activeIcon: <ActiveExplore />,
            homeactive: true,
            to: "/explore"
        }, {
            text: "Post",
            icon: <CreateIcon />,
            onClick: () => setIsCreating(true),
        }, {
            text: "Story",
            icon: <FaHistory />,
            onClick: () => setCreateStory(true),
        }, {
            text: "Profile",
            isImg: true,
            profileImg: userData.data.user.profilePic,
            to: `/${userData.data.user.userName}/`
        }
    ]

    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [])

    function handleClick(e) {
        if (checkref.current && dropdownRef.current && !checkref.current.contains(e.target) && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
        if (searchRef.current && searchBoxRef.current && !searchRef.current.contains(e.target) && !searchBoxRef.current.contains(e.target)) {
            setIsSearching(false)
            setSearchQuery("")
            setSearchData([]);
        }
    }

    function handleFileChange(event) {
        const files = Array.from(event.target.files);
        const imageUrls = files
            .filter(file => file.type.startsWith("image/"))
            .map(file => URL.createObjectURL(file));
        if (imageUrls.length > 0) {
            setSelectedImage(imageUrls);
        } else {
            alert("Please select an image file")
        }
    }

    function handleFile() {
        fileInputRef.current.click();
    }

    return <><aside className={`px-4 py-10 hidden md:block transition-[width] bg-[#000] duration-300 ${isSearching ? "w-[5%] border-r-0" : "w-[17%] border-r-[2px] border-[#262626]"} fixed z-[100] left-0 top-0 h-[100vh] w-[5rem] lg:w-[17%]`}>
        <Link to="/home"><img src="/images/instagramiconswhite.png" alt="Instagram Logo" className={`w-[6.5rem] ml-2 mb-9 ${isSearching ? "hidden" : "hidden lg:block"}`} /></Link>
        <NavLink to="/home"
            className={({ isActive }) =>
                `group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-block py-2 px-2 rounded-md mb-4 ${isActive ? "font-bold" : ""} ${isSearching ? "" : "block lg:hidden"}`
            }><InstagramSvg className="group-hover:scale-110 transition-transform duration-150" /></NavLink>
        <div className="flex flex-col gap-3">
            {sideBarItems?.map((item, i) => (
                <SideBarItems item={item} key={i} isSearching={isSearching} />
            ))}
        </div>
        <div
            ref={checkref}
            className={`gap-4 absolute bottom-5 group hover:bg-[rgba(255,255,255,.1)] transition cursor-pointer duration-300 inline-flex items-center p-2 rounded-md ${isOpen ? "font-bold" : ""} ${isSearching ? "w-10" : "lg:w-[90%] w-[50%]"}`}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <MoreIcon className="group-hover:scale-110 transition-transform duration-150" />
            <p className={`text-[15px] ${isSearching ? "hidden" : "hidden lg:block"}`}>More</p>
        </div>
        <SearchBox refere={searchBoxRef} isSearching={isSearching} />
    </aside >
        <LogOutDiv isOpen={isOpen} dropdownRef={dropdownRef} />
        <CreatePost isCreating={isCreating} fileInputRef={fileInputRef} selectedImage={selectedImage} setIsCreating={setIsCreating} setSelectedImage={setSelectedImage} handleFileChange={handleFileChange} handleFile={handleFile} />
        <CreateStory creatingStory={createStory} setIsCreatingStory={setCreateStory} />
    </>
}