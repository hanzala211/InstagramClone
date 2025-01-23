import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { SideBar } from "./components/sidebar/SideBar"
import { useUser } from "./context/UserContext";
import { LoadingPage } from "./pages/LoadingPage";
import { Footer } from "./components/helpers/Footer";
import { useEffect } from "react";
import { MobileBar } from "./components/sidebar/MobileBar"
import { useChat } from "./context/ChatContext";
import { SideBarProvider } from "./context/SideBarContext";
import { useAuth } from "./context/AuthContext";
import { getDataOnClick } from "./services/searchProfile";

export function Layout() {
    const { message, setMessage } = useUser();
    const { setSelectedChat } = useChat()
    const { mainLoading, setMainLoading, setToken, setSelectedProfile, fetchMe } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const localitem: string | null = JSON.parse(localStorage.getItem("token") || "null");
        if (localitem) {
            setToken(localitem);
            fetchMe(localitem);

            const currentPath = location.pathname;

            if (currentPath === "/") {
                navigate("/home");
            } else if (params.username && currentPath.split("/")[1] === "search") {
                fetchUserDataOnClick(params.username, localitem);
            } else {
                setTimeout(() => {
                    setMainLoading(false);
                }, 1000);
            }
        } else {
            navigate("/login");
        }
    }, []);



    useEffect(() => {
        if (location.pathname.slice(0, 14) !== "/direct/inbox/") {
            setSelectedChat(null)
        }
    }, [location.pathname])

    useEffect(() => {
        setTimeout(() => {
            setMessage("")
        }, 1500);
    }, [message])

    async function fetchUserDataOnClick(username: any, localitem: any) {
        try {
            setMainLoading(true);
            const res = await getDataOnClick({
                username: username,
                token: localitem
            })
            setSelectedProfile(res.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setMainLoading(false);
            }, 1000);
        }
    }


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