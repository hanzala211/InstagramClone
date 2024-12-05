import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Footer } from "../components/helpers/Footer";
import { Loader } from "../components/helpers/Loader";

export function SignUp() {
    const { setUserData, userData, setMainLoading } = useUser();
    const [emailAddress, setEmailAddress] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false)
    const [succesMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate()

    async function fetchData() {
        const data = JSON.stringify({
            "fullName": fullName,
            "userName": userName,
            "email": emailAddress,
            "password": signupPassword
        });
        try {
            setMainLoading(true)
            setLoading(true);
            setUserData({})
            setSuccessMessage("");
            const response = await fetch("https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data,
                redirect: "follow"
            })
            const result = await response.json();
            setUserData(result);
            if (result.status === "success") {
                setEmailAddress("")
                setSignupPassword("")
                setFullName("")
                setUserName("")
                setSuccessMessage(result.status)
                navigate("/home");
                localStorage.setItem("token", JSON.stringify(result.data.token))
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setMainLoading(false)
        }
    }

    return <div className="flex flex-col h-[100vh] justify-between">
        <section className="flex justify-center items-center w-full mt-12">
            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center flex-col border-[2px] border-[#363636] w-[23.7rem] h-[35rem] gap-4">
                    {!loading ? <><div className="w-full">
                        <Link><img src="/images/instagramiconswhite.png" alt="" className="w-1/2 mx-auto mt-10" /></Link>
                    </div>
                        <p className="text-center mx-[3.5rem] text-[15px] text-[#A8A8A8]">Sign up to see photos and videos from your friends.</p>
                        <div className="relative">
                            <h2 className="absolute z-[20] left-1/2 -translate-x-1/2 -top-[0.5rem] bg-[#000] p-3 text-[13px] rounded-full text-[#A8A8A8]">OR</h2>
                        </div>
                        <div className="flex flex-col gap-2 border-t-[1px] border-[#262626] pt-6">
                            <div className="relative">
                                <label htmlFor="email" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-100 -translate-y-1/2 left-2.5 absolute pointer-events-none ${emailAddress.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Email Address</label>
                                <input type="text" className="bg-[#121212] pl-2 h-[2.5rem] outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-150 -translate-y-1/2 left-2.5 absolute pointer-events-none ${signupPassword.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Password</label>
                                <input type="password" className="bg-[#121212] pl-2 h-[2.5rem] usernameInput outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                            </div>
                            <div className="relative">
                                <label htmlFor="fullname" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-150 -translate-y-1/2 left-2.5 absolute pointer-events-none ${fullName.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Full Name</label>
                                <input type="text" className="bg-[#121212] pl-2 h-[2.5rem] usernameInput outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </div>
                            <div className="relative">
                                <label htmlFor="username" className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-150 -translate-y-1/2 left-2.5 absolute pointer-events-none ${userName.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>Username</label>
                                <input type="text" className="bg-[#121212] pl-2 h-[2.5rem] usernameInput outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                            </div>
                            <Link to={(emailAddress.length > 0 && signupPassword.length > 0 && fullName.length > 0 && userName.length > 0) ? "#" : "#"} className="text-center bg-[#0069AD] text-[14px] py-2 rounded-lg mt-3 opacity-90" onClick={() => {
                                fetchData();
                            }}>Sign up</Link>
                        </div>
                        <p className="text-center mx-[2.5rem] text-[13px] text-[#A8A8A8]">People who use our service may have uploaded your contact information to Instagram. Learn more</p></> : <div className="mt-10"><Loader /></div>}
                    {succesMessage === "success" && <p className="text-green-600 uppercase">{succesMessage}</p>}
                </div>
                {userData?.status === "fail" && <p className="text-red-500">{userData.data}</p>}
                <div className="flex items-center justify-center border-[2px] border-[#363636] py-6 w-[23.7rem] gap-1">
                    <p>Have an account?</p>
                    <Link to="/login" onClick={() => setUserData([])} className="text-[#3897F1]">Log in</Link>
                </div>
                <p>Get the app.</p>
                <div className="flex gap-2">
                    <img src="/images/googlePlay.png" alt="Get on Google" className="w-36 h-11 rounded-[2px]" />
                    <img src="/images/microsoft.png" alt="Get on Microsoft" className="w-32 h-11 rounded-[2px]" />
                </div>
            </div>
        </section >
        <Footer />
    </div>
}