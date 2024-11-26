import { Outlet, useNavigate, useParams } from "react-router-dom";
import { SideBar } from "./components/SideBar";
import { SideBarProvider, useSearch, useUser } from "./context/UserContext";
import { LoadingPage } from "./pages/LoadingPage";
import { Footer } from "./components/Footer";
import { useEffect } from "react";
import { fetchUserDataOnClick } from "./utils/helper";

export function Layout({ token }) {
    const { mainLoading, setMainLoading, setUserData, message, setMessage } = useUser();
    const { setSelectedProfile } = useSearch();
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (token !== null) {
            fetchUser();
        } else {
            navigate("/login")
        }
    }, [token])

    useEffect(() => {
        setTimeout(() => {
            setMessage("")
        }, 1500);
    }, [message])

    async function fetchUser() {
        try {
            setMainLoading(true)
            setUserData([])
            const response = await fetch("https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/me", {
                method: "GET",
                headers: {
                    "Authorization": `${token}`
                },
                redirect: "follow"
            })
            const result = await response.json();
            setUserData({
                status: result.status,
                data: {
                    token: token,
                    user: {
                        ...result.data,
                    }
                }
            })
        } catch (error) {
            console.error(error)
        } finally {
            setMainLoading(false);
            if (params) {
                fetchUserDataOnClick(params.username, null, token, setSelectedProfile, setMainLoading)
            }
        }
    }

    return <>
        {!mainLoading ? <section className="flex flex-row w-full items-center">
            <div className="w-[17%] left-0 top-0 h-[100vh]"></div>
            <SideBarProvider>
                <SideBar />
            </SideBarProvider>
            <div className="flex flex-col gap-10 w-full">
                <Outlet />
                <Footer />
            </div>
            <div className={`fixed px-5 w-full flex items-center text-[15px] transition-all duration-300 bg-[#262626] ${message !== "" ? "h-[3rem] bottom-0" : "-bottom-16 h-[0rem]"}`}>
                {message}
            </div>
        </section> : <LoadingPage />}
    </>
}