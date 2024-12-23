import { MobilePostIcon, MobileSaveIcon, MobileTagIcon } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";
import { ProfileNavLink } from "./ProfileNavLink";

export function MobileProfileBar() {
    const { userData } = useUser();
    return <div className="md:hidden flex border-b-[1px] border-[#262626] flex-row justify-evenly gap-12 mt-0">
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