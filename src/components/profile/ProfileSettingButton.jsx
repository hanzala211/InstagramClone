import { Link } from "react-router-dom";

export const ProfileButton = ({ to, label }) => (
    <Link
        to={to}
        className="bg-[#363636] px-3 py-1 rounded-[0.5rem] text-[14px] flex justify-center min-w-[6rem] md:min-w-[8rem] hover:bg-[rgb(38,38,38)] transition duration-150"
    >
        {label}
    </Link>
);