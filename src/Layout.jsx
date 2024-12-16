import { Outlet, useLocation, useParams } from "react-router-dom";
import { SideBar } from "./components/sidebar/SideBar";
import { SideBarProvider, useSearch, useUser } from "./context/UserContext";
import { LoadingPage } from "./pages/LoadingPage";
import { Footer } from "./components/helpers/Footer";
import { useEffect } from "react";
import { fetchUserDataOnClick } from "./utils/helper";
import { MobileBar } from "./components/sidebar/MobileBar";
import { fetchMe } from "./services/userAuth";

export function Layout({ token }) {
    const { mainLoading, setMainLoading, setUserData, message, setMessage } = useUser();
    const { setSelectedProfile } = useSearch();
    const params = useParams()
    const location = useLocation()

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
            <div className={`left-0 top-0 md:block hidden h-[100vh] ${location.pathname.slice(0, 7) ? "w-[5rem]" : "w-[17%]"}`}></div>
            <SideBarProvider>
                <SideBar />
                <MobileBar />
            </SideBarProvider>
            <div className="flex flex-col gap-10 w-full">
                <Outlet />
                <Footer />
            </div>
            <div className={`fixed z-[5000000] px-5 w-full flex items-center text-[15px] transition-all duration-300 bg-[#262626] ${message !== "" ? "h-[3rem] bottom-0" : "-bottom-16 h-[0rem]"}`}>
                {message}
            </div>
        </section> : <LoadingPage />}
    </>
}