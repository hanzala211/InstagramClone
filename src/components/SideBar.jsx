import { Link, NavLink } from "react-router-dom";
import { ActiveHome, CreateIcon, ExploreIcon, HomeIcon, InstagramSvg, MoreIcon, ReportIcon, SaveIcon, SearchIcon } from "../assets/Constants";
import { useEffect, useRef, useState } from "react";
import { useSearch, useSideBar, useUser } from "../context/UserContext";
import { SearchBox } from "./SearchBox";
import { CreatePost } from "./CreatePosts";
import { FaHistory } from "react-icons/fa";
import { CreateStory } from "./CreateStory";

export function SideBar() {
    const { isSearching, setIsSearching } = useSideBar();
    const [isOpen, setIsOpen] = useState(false);
    const { userData, setUserData, setMainLoading } = useUser();
    const [isCreating, setIsCreating] = useState(false);
    const checkref = useRef(null);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const searchBoxRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [createStory, setCreateStory] = useState(false);
    const { setSearchQuery, setSearchData } = useSearch()
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
    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [])
    return <><aside className={`px-4 py-10 transition-[width] duration-300 ${isSearching ? "w-[4%] border-r-0" : "w-[17%] border-r-[2px] border-[#262626]"} fixed left-0 top-0 h-[100vh] `}>
        {!isSearching && <Link to="/home"><img src="/images/instagramiconswhite.png" alt="Instagram Logo" className="w-[6.5rem] ml-2 mb-9" /></Link>}
        {isSearching && <NavLink to="/home"
            end
            className={({ isActive }) =>
                `group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-block py-2 px-2 rounded-md mb-9 ${isActive ? "font-bold" : ""}`
            }><InstagramSvg className="group-hover:scale-110 transition-transform duration-150" /></NavLink>}
        <div className="flex flex-col gap-3">
            <NavLink
                to="/home"
                end
                className={({ isActive }) =>
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isActive ? "font-bold" : ""} ${isSearching ? "w-10 h-10" : ""}`
                }
            >{({ isActive }) => {
                return <>{isActive && !isSearching ? <ActiveHome className={`group-hover:scale-110 transition-transform duration-150`} /> : <HomeIcon className={`group-hover:scale-110 transition-transform duration-150 stroke-[#F5F5F5]`} />}
                    <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Home</p></>
            }}
            </NavLink >
            <NavLink
                className={
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md $ ${isSearching ? "w-10 h-10 border-[1px] rounded-lg" : ""}`
                }
                onClick={() => setIsSearching((prev) => !prev)}
                ref={searchRef}
            >
                <SearchIcon className="group-hover:scale-110 transition-transform duration-150" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""} `}>Search</p>
            </NavLink>
            <NavLink
                end
                to="/explore"
                className={({ isActive }) =>
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isActive ? "font-bold" : ""} ${isSearching ? "w-10 h-10" : ""}`
                }
            >
                <ExploreIcon className="group-hover:scale-110 transition-transform duration-150" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Explore</p>
            </NavLink>
            {/* <NavLink
                end
                to="/direct/inbox"
                className={({ isActive }) =>
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isActive ? "font-bold" : ""} ${isSearching ? "w-10 h-10" : ""}`
                }
            >
                <MessageIcon className="group-hover:scale-110 transition-transform duration-150" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Messages</p>
            </NavLink>
            <NavLink
                end
                to="/notification"
                className={({ isActive }) =>
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isActive ? "font-bold" : ""} ${isSearching ? "w-10 h-10" : ""}`
                }
            >
                <NotificationIcon className="group-hover:scale-110 transition-transform duration-150" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Notifications</p>
            </NavLink> */}
            <NavLink
                onClick={() => setIsCreating(true)}
                className={`gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isSearching ? "w-10 h-10" : ""}`}
            >
                <CreateIcon className="group-hover:scale-110 transition-transform duration-150" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Create</p>
            </NavLink>
            <NavLink
                onClick={() => setCreateStory(true)}
                className={`gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isSearching ? "w-10 h-10" : ""}`}
            >
                <FaHistory className="group-hover:scale-110 transition-transform duration-150 text-[25px]" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Story</p>
            </NavLink>
            <NavLink
                to={`/${userData.data.user.userName}/`}
                className={({ isActive }) =>
                    `gap-4 group hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex items-center p-2 py-3 rounded-md ${isActive ? "font-bold" : ""} ${isSearching ? "w-10 h-10" : ""}`
                }
            >
                <img src={userData.data.user.profilePic} id="image" alt="userIcon" className="rounded-full w-6 group-hover:scale-110" />
                <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>Profile</p>
            </NavLink>
        </div>
        <div
            ref={checkref}
            className={`gap-4 items-center group absolute bottom-5 w-[90%] hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-2 rounded-md cursor-pointer ${isOpen ? "font-bold" : ""} ${isSearching ? "w-[50%]" : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <MoreIcon className="group-hover:scale-110 transition-transform duration-150" />
            <p className={`text-[15px] ${isSearching ? "hidden" : ""}`}>More</p>
        </div>
        <SearchBox refere={searchBoxRef} isSearching={isSearching} />
    </aside >
        {
            isOpen && <div className="fixed bg-[#262626] w-[13%] z-[50] modal bottom-20 left-8 rounded-[1rem]" ref={dropdownRef} >
                <div className="border-b-[4px] border-[#353535] px-2 py-3">
                    <Link
                        to={`/${userData.data.user.userName}/saved/`}
                        className="gap-4 items-center py-3 group w-full hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-2 rounded-md"
                    >
                        <SaveIcon />
                        <p className="text-[15px]">Saved</p>
                    </Link>
                    <Link
                        to="#"
                        className="gap-4 items-center py-3 group w-full hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-2 rounded-md"
                    >
                        <ReportIcon />
                        <p className="text-[15px]">Report</p>
                    </Link>
                </div>
                <div className="px-2 py-2.5">
                    <Link
                        to="/login"
                        end
                        className="gap-4 items-center group w-full py-3 hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-4 rounded-md"
                        onClick={() => {
                            setMainLoading(true)
                            setUserData([])
                            localStorage.removeItem("token")
                            setTimeout(() => {
                                window.location.reload();
                            }, 500)
                        }}
                    >
                        <p className="text-[14px]">Log out</p>
                    </Link>
                </div>
            </div>
        }
        <CreatePost isCreating={isCreating} fileInputRef={fileInputRef} selectedImage={selectedImage} setIsCreating={setIsCreating} setSelectedImage={setSelectedImage} handleFileChange={handleFileChange} handleFile={handleFile} />
        <CreateStory creatingStory={createStory} setIsCreatingStory={setCreateStory} />
    </>
}