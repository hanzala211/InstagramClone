export const FollowButton = ({ isFollowed, isDisabled, onClick }) => (
    <button
        disabled={isDisabled}
        className={`${isFollowed ? "bg-[#363636]" : "bg-[#0095F6]"} px-7 py-1 rounded-lg ${isDisabled ? "opacity-50" : ""}`}
        onClick={onClick}
    >
        {isFollowed ? "Unfollow" : "Follow"}
    </button>
);
