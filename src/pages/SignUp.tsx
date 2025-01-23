import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/helpers/Footer";
import { Loader } from "../components/helpers/Loader";
import { InputLabel } from "../components/helpers/InputLabel";
import { FormType } from "../types/authType";
import { useAuth } from "../context/AuthContext";

export const SignUp: React.FC = () => {
    const { userData, setEmail, email, setPassword, password, fullName, setFullName, userValue, setUserValue, succesMessage, fetchSignup, loading } = useAuth();

    const signupForm: FormType[] = [
        {
            onChange: (e: any) => setEmail(e.target.value),
            text: "Email Address",
            value: email,
            type: "email"
        },
        {
            onChange: (e: any) => setPassword(e.target.value),
            text: "Password",
            value: password,
            type: "password"
        },
        {
            onChange: (e: any) => setFullName(e.target.value),
            text: "Full Name",
            value: fullName,
            type: "text"
        },
        {
            onChange: (e: any) => setUserValue(e.target.value),
            text: "Username",
            value: userValue,
            type: "text"
        }
    ]

    const handleClick = () => {
        setUserValue("")
        setPassword("")
        setEmail("")
        setFullName("")
    }

    return <div className="flex flex-col h-[100vh] justify-between">
        <section className="flex justify-center items-center w-full sm:mt-12 mt-2">
            <div className="flex flex-col gap-3 items-center">
                <div className="flex items-center flex-col border-[2px] border-[#363636] sm:w-[23.7rem] w-[22rem] h-[35rem] gap-4">
                    {!loading ? <><div className="w-full">
                        <div><img src="/images/instagramiconswhite.png" alt="" className="w-1/2 mx-auto mt-10" /></div>
                    </div>
                        <p className="text-center mx-[3.5rem] text-[15px] text-[#A8A8A8]">Sign up to see photos and videos from your friends.</p>
                        <div className="relative">
                            <h2 className="absolute z-[20] left-1/2 -translate-x-1/2 -top-[0.5rem] bg-[#000] p-3 text-[13px] rounded-full text-[#A8A8A8]">OR</h2>
                        </div>
                        <div className="flex flex-col gap-2 border-t-[1px] border-[#262626] pt-6">
                            {signupForm.map((item, index) => (
                                <InputLabel key={index} onChange={item.onChange} value={item.value} text={item.text} type={item.type} />
                            ))}
                            <Link to={(email.length > 0 && password.length > 0 && fullName.length > 0 && userValue.length > 0) ? "#" : "#"} onClick={fetchSignup} className="text-center bg-[#0069AD] text-[14px] py-2 rounded-lg mt-3 opacity-90" >Sign up</Link>
                        </div>
                        <p className="text-center mx-[2.5rem] text-[13px] text-[#A8A8A8]">People who use our service may have uploaded your contact information to Instagram. Learn more</p></> : <div className="mt-10"><Loader /></div>}
                    {succesMessage === "success" && <p className="text-green-600 uppercase">{succesMessage}</p>}
                </div>
                {userData?.status === "fail" && <p className="text-red-500">{userData.data}</p>}
                <div className="flex items-center justify-center border-[2px] border-[#363636] py-6 sm:w-[23.7rem] w-[22rem] gap-1">
                    <p>Have an account?</p>
                    <Link to="/login" onClick={handleClick} className="text-[#3897F1]">Log in</Link>
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