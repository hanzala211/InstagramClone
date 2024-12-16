import { useEffect, useRef, useState } from "react"
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { imagesArr } from "../assets/Constants";
import { Footer } from "../components/helpers/Footer";
import { useUser } from "../context/UserContext";
import { Loader } from "../components/helpers/Loader";
import { LoadingPage } from "./LoadingPage";
import { fetchUser } from "../services/userAuth";

export function Login() {
    const { setMainLoading, setUserData, userData, mainLoading } = useUser();
    const [userValue, setUserValue] = useState("");
    const [password, setPassword] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setMainLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesArr.length);
                setIsAnimating(false);
            }, 100);
        }, 3000);

        return () => clearInterval(interval);
    }, [imagesArr.length]);



    return (
        <>
            {!mainLoading ?
                <div className="h-[100vh] flex flex-col justify-between">
                    <section className="flex justify-center mt-12 items-center gap-5 w-full">
                        <div className="w-[27rem] hidden md:block h-[37rem] bg-no-repeat relative" style={{ backgroundImage: "url('/images/home-phones.png')" }}>
                            <img src={imagesArr[currentIndex]} alt="ScreenShots" className={`absolute left-[65%] -translate-x-1/2 top-7 transition-all ${isAnimating ? "animating opacity-50" : "opacity-100"}`} />
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <div className={`flex items-center flex-col border-[2px] border-[#363636] w-[23.7rem] gap-6 h-[27rem]`}>
                                {!loading ? <><div className="w-full">
                                    <Link><img src="/images/instagramiconswhite.png" alt="" className="w-1/2 mx-auto mt-10" /></Link>
                                </div>
                                    <div className="flex flex-col gap-2 border-b-[1px] border-[#262626] pb-6">
                                        <div className="relative">
                                            <label htmlFor="username" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-100 -translate-y-1/2 left-2.5 absolute pointer-events-none ${userValue.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Phone number, username or email address</label>
                                            <input type="text" className="bg-[#121212] pl-2 h-[2.5rem] outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="username" value={userValue} ref={inputRef} onChange={(e) => setUserValue(e.target.value)} />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="password" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-150 -translate-y-1/2 left-2.5 absolute pointer-events-none ${password.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Password</label>
                                            <input type="password" className="bg-[#121212] pl-2 h-[2.5rem] usernameInput outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <Link to={userData?.status === "success" ? "/home" : "#"} className="text-center bg-[#0069AD] text-[14px] py-2 rounded-lg mt-3 opacity-90" onClick={() => {
                                            fetchUser(userValue,
                                                password,
                                                setLoading,
                                                setUserData,
                                                setUserValue,
                                                setPassword,
                                                setMainLoading,
                                                navigate);
                                        }}>Log in</Link>
                                    </div>
                                    <div className="relative">
                                        <h2 className="absolute z-[20] left-1/2 -translate-x-1/2 -top-[2.8rem] bg-[#000] p-3 text-[13px] rounded-full text-[#A8A8A8]">OR</h2>
                                    </div>
                                    <Link className="flex items-center gap-2 text-[#3897F1] hover:text-white"><span><FaFacebook style={{ fill: "#3897F1" }} className="text-[25px]" /></span>Log in with Facebook</Link>
                                    {userData?.status === "fail" && <p className="text-red-500">{userData.data}</p>}
                                </> : <div className="mt-2"><Loader /></div>}
                            </div>
                            <div className="flex items-center justify-center border-[2px] border-[#363636] py-6 w-[23.7rem] gap-1">
                                <p>Don't have an account?</p>
                                <Link to="/signup" className="text-[#3897F1]">Sign up</Link>
                            </div>
                            <p>Get the app.</p>
                            <div className="flex gap-2">
                                <img src="/images/googlePlay.png" alt="Get on Google" className="w-36 h-11 rounded-[2px]" />
                                <img src="/images/microsoft.png" alt="Get on Microsoft" className="w-32 h-11 rounded-[2px]" />
                            </div>
                        </div>
                    </section>
                    <Footer /></div>
                : <LoadingPage />}
        </>
    );
}