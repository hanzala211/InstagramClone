import { MobilePostIcon, MobileSaveIcon, MobileTagIcon } from "../../assets/Constants";
import { ProfileNavLink } from "./ProfileNavLink";
import { useAuth } from "../../context/AuthContext";

export const MobileProfileBar = () => {
    const { userData } = useAuth()

    return <div className="md:hidden flex border-b-[1px] border-[#262626] flex-row justify-evenly gap-2 md:gap-12 mt-0">
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/`}
            icon={MobilePostIcon}
        />
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/saved/`}
            icon={MobileSaveIcon}
        />
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/tagged/`}
            icon={MobileTagIcon}
        />
    </div>
}