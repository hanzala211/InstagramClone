import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { EditPost } from "./EditPost";
import { usePost } from "../../context/PostContext";
import { Overlay } from "../helpers/Overlay";
import { postDelete } from "../../services/post";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PostSettingsProps {
    isPostSettingOpen: boolean;
    setIsPostSettingOpen: (value: boolean) => void;
    setIsPostOpen: (value: boolean) => void;
    isMyPost?: boolean;
}

export const PostSettings: React.FC<PostSettingsProps> = ({ isPostSettingOpen, setIsPostSettingOpen, setIsPostOpen, isMyPost }) => {
    const { setMessage, innerWidth } = useUser();
    const { userData, setUserData, token } = useAuth()
    const { selectedPost, setSelectedPost, setCurrentIndex, captionValue, setCaptionValue, setCroppedImages, setUserPosts, updatePost } = usePost();
    const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false)
    const [isShared, setIsShared] = useState<boolean>(false)
    const [shareLoading, setShareLoading] = useState<boolean>(false);
    const navigate = useNavigate()

    useEffect(() => {
        setCaptionValue(selectedPost !== null ? selectedPost.caption : "");
    }, [isEditingOpen])

    function handleClose() {
        setIsPostSettingOpen(false)
        setIsEditingOpen(false)
        setIsShared(false);
    }

    function handleIncrease() {
        setCurrentIndex((prev) => prev + 1)
    }

    function handleDecrease() {
        setCurrentIndex((prev) => prev - 1)
    }

    const deletePost = async () => {
        try {
            const res = await postDelete({
                token,
                selectedPost
            })
            setMessage(res.data);
            setUserData((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    user: {
                        ...prev.data.user,
                        posts: prev.data.user.posts.filter(
                            (item: any) => item !== selectedPost?._id
                        ),
                        postCount: prev.data.user.postCount - 1,
                    },
                },
            }));
            setUserPosts((prev: any) =>
                prev.filter((item: any) => item._id !== selectedPost?._id)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedPost(null);
            setIsPostSettingOpen(false);
            setIsPostOpen(false);
        }
    }

    return <>
        <div
            className={`overlay opacity-0 transition-all z-[200] duration-500 ${!isPostSettingOpen ? "pointer-events-none" : "opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div
            className={`bg-[#262626] xl:w-96 w-72 rounded-2xl fixed z-[1000] opacity-0 transition duration-300 inset-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 
              ${!isPostSettingOpen ? "pointer-events-none" : "opacity-100"} 
              ${isMyPost ? "xl:h-[14.5rem] h-[12.2rem]" : "xl:h-[8.5rem] h-[7rem]"}`}
            style={{
                maxWidth: 'calc(100vw - 4rem)',
                maxHeight: 'calc(100vh - 4rem)',
            }}
        >
            {isMyPost && (
                <>
                    <button className="text-red-600 w-full p-3 xl:text-[14px] text-[10px] active:opacity-70 font-semibold border-b-[1px] border-[#363636]" onClick={deletePost}>Delete
                    </button>
                    <button className="w-full p-3 border-b-[1px] xl:text-[14px] text-[10px] active:opacity-70 font-semibold border-[#363636]" onClick={() => {
                        if (innerWidth > 770) {
                            setIsEditingOpen(true);
                        } else {
                            setCroppedImages(selectedPost.imageUrls)
                            navigate("/edit/details/")
                        }
                        setIsPostSettingOpen(false);
                    }}>Edit</button>
                </>
            )}
            <button className="w-full p-3 border-b-[1px] xl:text-[14px] text-[10px] active:opacity-70 font-semibold border-[#363636]">
                Copy Link
            </button>
            <button className="w-full p-3 border-b-[1px] xl:text-[14px] text-[10px] active:opacity-70 font-semibold border-[#363636]">
                About this Account
            </button>
            <button
                className="w-full p-3 xl:text-[14px] text-[10px] font-semibold active:opacity-70"
                onClick={() => setIsPostSettingOpen(false)}
            >
                Cancel
            </button>
        </div>
        <Overlay handleClose={handleClose} isPostOpen={isEditingOpen} />
        <div
            className={`fixed opacity-0 top-[51%] -translate-y-1/2 -translate-x-1/2 left-1/2 transition-all duration-500 z-[150] ${isEditingOpen ? "opacity-100" : "pointer-events-none"
                } border-y-[1px] border-[#363636]`}
        >
            <div className={`bg-[#262626] xl:w-[70vw] w-[85vw] h-[92vh] transition-all duration-300 flex flex-col opacity-0 ${isEditingOpen ? "opacity-100" : "pointer-events-none"}`}>
                <EditPost croppedImage={selectedPost !== null ? selectedPost.imageUrls : []} handleIncrease={handleIncrease} handleDecrease={handleDecrease} />
            </div>
            <button className="text-[#0095F6] absolute z-[200] -top-7 right-0 hover:text-white text-[15px]" onClick={() => updatePost(setIsEditingOpen)}>Update</button>
        </div>
        <div
            className={`overlay opacity-0 transition-all z-[150] backdrop-blur-sm duration-500 ${!isShared ? "pointer-events-none" : "opacity-100"
                }`}
            onClick={handleClose}
        ></div>
        <div className={`bg-[#262626] fixed top-[51%] z-[150] -translate-y-1/2 -translate-x-1/2 left-1/2 w-[40vw] h-[93vh] flex flex-col justify-center items-center opacity-0 transition duration-500 ${isShared ? "opacity-100" : "pointer-events-none"}`}>
            {shareLoading ? <img src="/images/sharedLoader.gif" alt="loading" className="w-32" /> : <img src="/images/sharedPost.gif" alt="loaded" className="w-32" />}
            {shareLoading ? "" : <p className="text-[20px] font-semibold mt-5">Your post has been updated.</p>}
        </div>
    </>
}
