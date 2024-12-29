import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../../context/PostContext";
import { ActiveChatInfoSVG, ChatIcon, ChatInfoSVG, ChatSearchIcon, CrossIcon } from "../../assets/Constants";
import { useChat } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";
import { fetchUserDataOnClick } from "../../services/searchProfile";
import { onCropImage } from "../../utils/helper";
import { createPost, updatePost } from "../../services/post";
import { useSearch } from "../../context/SearchContext";

interface PageHeaderProps{
    isArrowNeeded?: boolean;
    isHomePage?: boolean;
    isInbox?: boolean;
    isChat?: boolean;
    isChatting?: boolean;
    isCross?: boolean;
    isDetails?: boolean;
    isCreating?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ isArrowNeeded, isHomePage, isInbox, isChat, isChatting, isCross, isDetails, isCreating }) => {
    const { setSelectedPost, setComments, setSelectedImage, croppedAreas, setCroppedImages, selectedImage, setCurrentIndex, setLoading, setIsCaption, croppedImages, setIsShared, setCaptionValue, captionValue, isShared, setShareLoading, selectedPost, } = usePost();
    const { setSelectedProfile } = useSearch();
    const { userData, setMainLoading, setMessage } = useUser();
    const { notifications, selectedChat, setIsChatSearch, isInfoOpen, setIsInfoOpen } = useChat();
    const navigate = useNavigate();

    function handleNavigateBack() {
        navigate(isChatting ? "/direct/inbox/" : isChat ? "/home" : -1);
        setTimeout(() => {
            setSelectedPost(null);
        }, 400);
        setComments([]);
        setIsInfoOpen(false);
    };

    function handleCrossClick() {
        navigate(-1);
        setTimeout(() => {
            setSelectedImage(null);
        }, 300);
    };

    function handleUserClick() {
        fetchUserDataOnClick(selectedChat?.userName, userData, null, setSelectedProfile, setMainLoading);
        setMainLoading(true);
    };

    function handleCropImage() {
        onCropImage(selectedImage, croppedAreas, setCroppedImages, setLoading, setCurrentIndex, setIsCaption);
    };

    function handlePostAction() {
        if (isCreating) {
            createPost(setShareLoading, setIsShared, croppedImages, userData, captionValue, setCaptionValue, true, navigate);
        } else {
            updatePost(setShareLoading, setIsShared, null, userData, captionValue, selectedPost, setMessage, navigate, setCaptionValue);
        }
    };

    const renderHeaderTitle = () => {
        if (isHomePage) return <img src="/images/instagramiconswhite.png" className="w-24 absolute left-1/2 -translate-x-1/2 mt-1.5" />;
        if (isChatting) return null;

        return (
            <h1 className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-semibold ${isCross ? "" : "text-[18px]"}`}>
                {isInbox ? "Inbox" : isChat ? userData?.data?.user.userName : isCross
                    ? "New photo post" : isCreating && !isShared ? "New Post" : !isCreating && !isShared && isCreating !== undefined ? "Edit Post" : isShared ? "Sharing..." : "Post"
                }</h1>
        );
    };

    return (
        <div className={`fixed py-6 z-[10] top-0 bg-[#000] flex md:hidden items-center ${isChat && !isChatting ? "" : " border-b-[2px] border-[#111111]"} w-full h-[2rem]`}>
            {isArrowNeeded && <FaChevronLeft onClick={handleNavigateBack} className="text-[20px] ml-4" />}
            {isCross && <button onClick={handleCrossClick}><CrossIcon className="ml-4" /></button>}
            {isChatting && (
                <>
                    <img src={selectedChat?.profilePic} className="w-6 ml-3 rounded-full" alt={selectedChat?.userName} />
                    <Link to={`/search/${selectedChat?.userName}/`} onClick={handleUserClick} className="font-bold ml-3 text-[13px]">
                        {selectedChat?.fullName}
                    </Link>
                    <button className="absolute right-2" onClick={() => setIsInfoOpen((prev) => !prev)}>
                        {isInfoOpen ? <ActiveChatInfoSVG /> : <ChatInfoSVG />}
                    </button>
                </>
            )}
            {renderHeaderTitle()}
            {isHomePage && (
                <Link to="/direct/inbox/" className="relative left-[92%]">
                    {notifications.length > 0 && (
                        <div className="absolute w-4 h-4 border-[1px] border-black text-white bg-red-600 rounded-full text-[10px] text-center -right-1 -top-1">
                            {notifications.length}
                        </div>
                    )}
                    <ChatIcon />
                </Link>
            )}
            {isChat && !isChatting && (
                <button onClick={() => setIsChatSearch(true)} className="relative left-[82%] hover:opacity-70 transition duration-200">
                    <ChatSearchIcon />
                </button>
            )}
            {isCross && (
                <Link to="/create/details/" onClick={handleCropImage} className="text-[#0096f4] text-[17px] font-semibold relative left-[78%] hover:opacity-70 transition duration-200">
                    Next
                </Link>
            )}
            {isDetails && (
                <button onClick={handlePostAction} className="text-[#0096f4] text-[17px] font-semibold relative left-[74%] hover:opacity-70 transition duration-200">
                    {isCreating ? "Share" : "Update"}
                </button>
            )}
        </div>
    );
}
