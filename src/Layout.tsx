import { Outlet, useLocation, useParams } from "react-router-dom";
import { SideBar } from "./components/sidebar/SideBar"
import { useUser } from "./context/UserContext";
import { LoadingPage } from "./pages/LoadingPage";
import { Footer } from "./components/helpers/Footer";
import { useEffect } from "react";
import { MobileBar } from "./components/sidebar/MobileBar"
import { fetchMe } from "./services/userAuth";
import { fetchUserDataOnClick } from "./services/searchProfile";
import { useChat } from "./context/ChatContext";
import { useSearch } from "./context/SearchContext";
import { SideBarProvider } from "./context/SideBarContext";

export function Layout({ token }: { token: string | null }) {
    const { mainLoading, setMainLoading, setUserData, message, setMessage } = useUser();
    const { setSelectedChat } = useChat()
    const { setSelectedProfile } = useSearch();
    const params = useParams()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.slice(0, 14) !== "/direct/inbox/") {
            setSelectedChat(null)
        }
    }, [location.pathname])

    useEffect(() => {
        if (token !== null) {
            fetchMe(setMainLoading, setUserData, token, params, fetchUserDataOnClick, setSelectedProfile);
        }
    }, [token])

    useEffect(() => {
        setTimeout(() => {
            setMessage("")
        }, 1500);
    }, [message])

    return <>
        {!mainLoading ? <section className="flex flex-row w-full items-center">
            <div className={`left-0 top-0 md:block hidden h-[100vh] ${location.pathname.slice(0, 7) === "/direct" ? "w-[5.5rem]" : "lg:w-[15rem] xl:left-[5rem] w-[10rem]"}`}></div>
            <SideBarProvider>
                <SideBar />
                <MobileBar />
            </SideBarProvider>
            <div className="flex flex-col md:gap-2 w-full">
                <Outlet />
                <Footer />
            </div>
            <div className={`fixed z-[5000000] px-5 w-full flex items-center text-[15px] transition-all duration-300 bg-[#262626] ${message !== "" ? "h-[3rem] bottom-0" : "-bottom-16 h-[0rem]"}`}>
                {message}
            </div>
        </section> : <LoadingPage />}
    </>
}