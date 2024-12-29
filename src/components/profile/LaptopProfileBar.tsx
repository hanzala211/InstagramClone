import { PostsIcon, SavedIcon, TaggedUser } from "../../assets/Constants";
import { useUser } from "../../context/UserContext";
import { ProfileNavLink } from "./ProfileNavLink";

export const LaptopProfileBar = () => {
    const { userData } = useUser()

    return <div className="absolute hidden 1280:left-[55%] lg:left-[59%] md:left-[60%] -translate-x-1/2 md:flex flex-row gap-10 mt-0">
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/`}
            icon={PostsIcon}
            label="POSTS"
            isMyProfile={true}
        />
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/saved/`}
            icon={SavedIcon}
            label="SAVED"
            isMyProfile={true}
        />
        <ProfileNavLink
            to={`/${userData?.data?.user.userName}/tagged/`}
            icon={TaggedUser}
            label="TAGGED"
            isMyProfile={true}
        />
    </div>
}   