import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { UserModal } from "./UserModal";
import { Skeleton } from "../helpers/Skeleton";
import { Overlay } from "../helpers/Overlay";
import { getFollowers, getFollowing } from "../../services/followerModal";
import { useAuth } from "../../context/AuthContext";

interface UserFollowModalProps {
    isFollowerModalOpen: boolean;
    setIsFollowerModalOpen: (value: boolean) => void;
    isFollowingModalOpen: boolean;
    setIsFollowingModalOpen: (value: boolean) => void
}

export const UserFollowModal: React.FC<UserFollowModalProps> = ({ isFollowerModalOpen, setIsFollowerModalOpen, isFollowingModalOpen, setIsFollowingModalOpen }) => {
    const { userFollowers, setUserFollowers, userFollowing, setUserFollowing } = useUser();
    const { userData, setSelectedProfile, token } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>("");

    useEffect(() => {
        const body: any = document.querySelector("body");
        body.style.overflowY = isFollowerModalOpen || isFollowingModalOpen ? "hidden" : "auto";

        return () => body.style.overflowY = "auto";
    }, [isFollowerModalOpen, isFollowingModalOpen]);

    useEffect(() => {
        if (isFollowerModalOpen) {
            setModalType("followers");
            fetchFollowers();
        } else if (isFollowingModalOpen) {
            setModalType("following");
            fetchFollowing();
        }
    }, [isFollowerModalOpen, isFollowingModalOpen, userData, setUserFollowers, setUserFollowing]);

    function handleClose() {
        if (isFollowerModalOpen) {
            setIsFollowerModalOpen(false);
            setTimeout(() => setUserFollowers([]), 900);
        } else if (isFollowingModalOpen) {
            setIsFollowingModalOpen(false);
            setTimeout(() => setUserFollowing([]), 900);
        }
    }

    async function fetchFollowers() {
        try {
            setIsLoading(true);
            const res = await getFollowers({
                token
            })
            setUserFollowers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchFollowing() {
        try {
            setIsLoading(true);
            const res = await getFollowing({
                token
            })
            setUserFollowing(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const modalTitle = modalType === "followers" ? "Followers" : modalType === "following" ? "Following" : "";
    const modalContent = modalType === "followers" ? userFollowers : modalType === "following" ? userFollowing : [];

    return (
        <>
            <Overlay handleClose={handleClose} isPostOpen={isFollowerModalOpen || isFollowingModalOpen} />
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[20rem] rounded-xl border-y-[1px] bg-[#363636] border-[#363636] transition-all duration-500 z-[150] ${isFollowerModalOpen || isFollowingModalOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <div className="border-b-[1px] border-[#252525] h-[2rem] relative">
                    <h1 className="absolute left-1/2 top-1 text-[14px] -translate-x-1/2">{`User ${modalTitle}`}</h1>
                </div>
                <div className="overflow-auto scrollbar-hidden h-[20rem]">
                    {isLoading ? (
                        Array.from({ length: 15 }, (_, i) => (
                            <div key={i} className="ml-3 mt-5">
                                <Skeleton />
                            </div>
                        ))
                    ) : (
                        modalContent.map((item, i) => (
                            <UserModal
                                key={i}
                                index={i}
                                item={item}
                                isSearchModal={false}
                                setSelectedProfile={setSelectedProfile}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
