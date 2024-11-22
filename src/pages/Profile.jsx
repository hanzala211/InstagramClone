import { Link, NavLink, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext"
import { PostsIcon, SavedIcon, TaggedUser } from "../assets/Constants";
import { HighLights } from "../components/Highlights";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../components/Loader";
import { MdVerified } from "react-icons/md";
import { ProfileSettings } from "../components/ProfileSettings";
import NoteTooltip from "../components/Note";
import { NoteCreator } from "../components/NoteCreator";
import { NoteEditor } from "../components/NoteEditor";
import { HighLightsModal } from "../components/HighLightsModal";

export function Profile() {
    const [postsLoading, setPostsLoading] = useState(false);
    const [noteValue, setNoteValue] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [isNoteEditOpen, setIsNoteEditOpen] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [noteLoading, setNoteLoading] = useState(false);
    const [isCreatingHighLight, setIsCreatingHighLight] = useState(false);
    const noteEditorRef = useRef(null);
    const { userData, setUserPosts, note, setNote, setMessage, setStories, stories, setCurrentStory, highlights, setHighlights, setHighLightStories, setCurrentHighLight, setUserSaves } = useUser();
    useEffect(() => {
        const body = document.querySelector("body");
        body.style.overflowY = isEditOpen ? "hidden" : "auto";

        return () => body.style.overflowY = "auto"
    }, [isEditOpen])
    useEffect(() => {
        async function fetchPosts() {
            try {
                setPostsLoading(true);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/post/my-posts`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                });
                const result = await response.json();
                setUserPosts(result.data)
                console.log(result)
            } catch (error) {
                console.error(error);
            } finally {
                setTimeout(() => {
                    setPostsLoading(false);
                }, 500);
            }
        }
        fetchPosts();
    }, [])
    useEffect(() => {
        async function fetchSaves() {
            try {
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/saved-posts`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                })
                const result = await response.json();
                console.log(result)
                setUserSaves(result.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchSaves();
    }, [])
    useEffect(() => {
        async function fetchNote() {
            try {
                setNoteLoading(true);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/note`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                })
                const result = await response.json();
                if (result.message !== "Note not found or expired.") {
                    setNote(result.note)
                }
            } catch (error) {
                console.error(error);
            } finally {
                setNoteLoading(false);
            }
        }
        fetchNote()
    }, [])
    useEffect(() => {
        function handleClickOutside(event) {
            if (noteEditorRef.current && !noteEditorRef.current.contains(event.target)) {
                setIsNoteEditOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsNoteEditOpen]);
    useEffect(() => {
        async function getStatus() {
            try {
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/story`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                })
                const result = await response.json();
                setStories(result.stories)
            } catch (error) {
                console.error(error)
            }
        }
        getStatus()
    }, [])
    useEffect(() => {
        async function getHighLights() {
            try {
                setHighLightStories([]);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/highlights`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                })
                const result = await response.json();
                console.log(result);
                setHighlights(result.highlights)
                // const allStories = result.highlights.reduce((acc, item) => {
                //     return [...acc, ...item.stories];
                // }, []);
                // setHighLightStories(allStories);
            } catch (error) {
                console.error(error)
            }
        }
        if (highlights.length === 0) {
            getHighLights()
        }
    }, [])
    async function createNote() {
        try {
            setShareLoading(true);
            const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/note`, {
                method: "POST",
                headers: {
                    "Authorization": `${userData.data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "content": noteValue
                }),
                redirect: "follow"
            })
            const result = await response.json();
            setMessage(result.message);
            setNote(result.note)
        } catch (error) {
            console.error(error)
        } finally {
            setNoteValue("");
            setShareLoading(false);
            setIsNoteOpen(false);
        }
    }
    function handleCloseNote() {
        setIsNoteOpen(false)
        setNoteValue("");
    }
    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1) + 'B';
        } else if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1) + ' M';
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }
    return <section className="w-full max-w-[70%] mx-auto">
        <div className="w-[62rem] pb-9 pt-12 border-b-[2px] border-[#262626]">
            <div className="flex gap-20 ml-16 items-center relative">
                <div className="absolute -top-1 left-[7%] z-[1] cursor-pointer" onClick={() => {
                    if (note.length === 0) {
                        setIsNoteOpen(true)
                    } else {
                        setIsNoteEditOpen(true);
                    }
                }}>
                    {!isNoteEditOpen ? <NoteTooltip isProfile={true} note={note} noteLoading={noteLoading} /> : <div ref={noteEditorRef}><NoteEditor setIsNoteEditOpen={setIsNoteEditOpen} /></div>}
                </div>
                <Link to={stories.length > 0 ? `/stories/${userData.data.user.userName}/${stories[0]._id}/` : ""} className={`p-2 ${stories.length > 0 ? "relative rounded-full multicolor-border" : ""}`} onClick={() => setCurrentStory(0)}>
                    <img src={userData?.data?.user.profilePic} alt="User Profile" className="rounded-full w-40" />
                </Link>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-6 items-center">
                        <Link className="text-[20px] flex items-center gap-1">{userData?.data?.user.userName}
                            {userData.data.user.followers.length > 10 && <MdVerified className="fill-[#0095F6]" />}
                        </Link>
                        <div className="flex gap-3 items-center">
                            <button className="bg-[#363636] px-5 py-1.5 rounded-[0.5rem] text-[14px] hover:bg-[rgb(38,38,38)] transition duration-150" onClick={() => setIsEditOpen(true)}>Edit Profile</button>
                            <Link to="/archive/stories/" className="bg-[#363636] px-5 py-1.5 rounded-[0.5rem] text-[14px] hover:bg-[rgb(38,38,38)] transition duration-150">View Archive</Link>
                        </div>
                    </div>
                    <div className="flex gap-10 items-center">
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(userData.data.user.postCount)}</span>posts</p>
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(userData.data.user.followersCount)}</span>followers</p>
                        <p className="flex gap-1.5"><span className="font-semibold">{formatNumber(userData.data.user.followingCount)}</span>following</p>
                    </div>
                    <div>
                        <p className="font-semibold text-[14px]">{userData.data.user.fullName}</p>
                        <p className="font-semibold text-[14px]">{userData.data.user.bio}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-10 ml-5 mt-16 h-36 overflow-x-auto scrollbar-hidden">
                {highlights.length > 0 && highlights.map((item, i, arr) => <Link to={`/stories/highlight/${arr[i]._id}/`} key={i} onClick={() => {
                    setHighLightStories(highlights[i].stories)
                    setCurrentStory(0)
                    setCurrentHighLight(i)
                }}><HighLights title={item.name} image={item.profilePic} /></Link>)}
                <HighLights title="New" onClick={() => setIsCreatingHighLight(true)} />
            </div>
        </div>
        <div className="absolute left-[59%] -translate-x-1/2 flex gap-10">
            <NavLink end to={`/${userData?.data?.user.userName || userData.data.userName}/`} className={({ isActive }) => `flex items-center tracking-wider py-3 gap-1 text-[12px] ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}><PostsIcon /> POSTS</NavLink >
            <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/saved/`} className={({ isActive }) => `flex items-center tracking-wider py-3 text-[12px] gap-1 ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}><SavedIcon /> SAVED</NavLink>
            <NavLink to={`/${userData?.data?.user.userName || userData.data.userName}/tagged/`} className={({ isActive }) => `flex items-center tracking-wider py-3 text-[12px] gap-1  ${isActive ? "font-semibold border-t-[2px]" : "text-[##A8A8A8]"}`}><TaggedUser /> TAGGED</NavLink>
        </div>
        <div className="mt-[3.5rem]">
            {!postsLoading ? <Outlet /> : <Loader />}
        </div>
        <ProfileSettings userData={userData} isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
        <NoteCreator handleClose={handleCloseNote} isNoteOpen={isNoteOpen} noteValue={noteValue} setNoteValue={setNoteValue} setIsNoteOpen={setIsNoteOpen} note={note} setNote={setNote} noteFunction={createNote} shareLoading={shareLoading} />
        <HighLightsModal isCreatingHighLight={isCreatingHighLight} setIsCreatingHighLight={setIsCreatingHighLight} />
    </section >
}