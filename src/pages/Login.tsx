import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { imagesArr } from "../assets/Constants";
import { Footer } from "../components/helpers/Footer";
import { Loader } from "../components/helpers/Loader";
import { LoadingPage } from "./LoadingPage";
import { InputLabel } from "../components/helpers/InputLabel";
import { FormType } from "../types/authType";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
    const { setMainLoading, userData, mainLoading, userValue, setUserValue, password, setPassword, loading, fetchLogin } = useAuth();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

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

    const handleClick = () => {
        setUserValue("")
        setPassword("")
    }

    const loginForm: FormType[] = [
        {
            onChange: (e: any) => setUserValue(e.target.value),
            text: "Phone number, username or email address",
            value: userValue,
            type: "text"
        },
        {
            onChange: (e: any) => setPassword(e.target.value),
            text: "Password",
            value: password,
            type: "password"
        }
    ]

    return (
        <>
            {!mainLoading ?
                <div className="h-[100vh] flex flex-col justify-between">
                    <section className="flex justify-center mt-12 items-center lg:gap-5 gap-1 w-full">
                        <div className="w-[27rem] hidden md:block h-[37rem] bg-no-repeat relative" style={{ backgroundImage: "url('/images/home-phones.png')" }}>
                            <img src={imagesArr[currentIndex]} alt="ScreenShots" className={`absolute left-[68%] md:left-[65%] -translate-x-1/2 top-7 transition-all ${isAnimating ? "animating opacity-50" : "opacity-100"}`} />
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <div className={`flex items-center flex-col border-[2px] border-[#363636] w-[22rem] lg:w-[23.7rem] gap-6 lg:h-[27rem] h-[25rem]`}>
                                {!loading ? <><div className="w-full">
                                    <div><img src="/images/instagramiconswhite.png" alt="" className="w-1/2 mx-auto mt-10" /></div>
                                </div>
                                    <div className="flex flex-col gap-0.5 md:gap-2 border-b-[1px] border-[#262626] pb-6">
                                        {loginForm.map((item, index) => (
                                            <InputLabel key={index} onChange={item.onChange} value={item.value} text={item.text} type={item.type} />
                                        ))}
                                        <Link onClick={fetchLogin} to={userData?.status === "success" ? "/home" : "#"} className="text-center bg-[#0069AD] text-[14px] py-2 rounded-lg mt-3 opacity-90">Log in</Link>
                                    </div>
                                    <div className="relative">
                                        <h2 className="absolute z-[20] left-1/2 -translate-x-1/2 -top-[2.8rem] bg-[#000] p-3 text-[13px] rounded-full text-[#A8A8A8]">OR</h2>
                                    </div>
                                    <Link to="/accounts/password/forgot/" className="flex items-center gap-2 text-[#3897F1] hover:text-white">Forgotten your password?</Link>
                                    {userData?.status === "fail" && <p className="text-red-500">{userData.data}</p>}
                                </> : <div className="mt-2"><Loader /></div>}
                            </div>
                            <div className="flex items-center justify-center border-[2px] border-[#363636] py-6 lg:w-[23.7rem] w-[22rem] gap-1">
                                <p>Don't have an account?</p>
                                <Link to="/signup" onClick={handleClick} className="text-[#3897F1]">Sign up</Link>
                            </div>
                            <p>Get the app.</p>
                            <div className="flex gap-2">
                                <img src="/images/googlePlay.png" alt="Get on Google" className="w-36 h-11 rounded-[2px]" />
                                <img src="/images/microsoft.png" alt="Get on Microsoft" className="w-32 h-11 rounded-[2px]" />
                            </div>
                        </div>
                    </section >
                    <Footer /></div >
                : <LoadingPage />}
        </>
    );
}