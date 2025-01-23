import { Link } from "react-router-dom";
import { Footer } from "../components/helpers/Footer";
import { Loader } from "../components/helpers/Loader";
import { InputLabel } from "../components/helpers/InputLabel";
import { ForgetPassword } from "../assets/Constants";
import { FormType } from "../types/authType";
import { useAuth } from "../context/AuthContext";

export const ForgotPassword: React.FC = () => {
    const { forgotResult, email, setEmail, codeValue, setCodeValue, password, setPassword, forgotPassword, loading, resetPassword } = useAuth()

    const forgotForm: FormType[] = [
        {
            onChange: (e: any) => setEmail(e.target.value),
            text: "Email Address",
            value: email,
            type: "email"
        }
    ]


    const resetForm: FormType[] = [
        {
            onChange: (e: any) => setCodeValue(e.target.value),
            text: "Code",
            value: codeValue,
            type: "email"
        },
        {
            onChange: (e: any) => setPassword(e.target.value),
            text: "New Password",
            value: password,
            type: "password"
        }
    ]

    return <div className="flex flex-col h-[100vh] justify-between">
        <section className="flex justify-center items-center w-full sm:mt-12 mt-2">
            <div className="flex flex-col gap-3 items-center">
                <div className={`flex items-center flex-col border-[2px] border-[#363636] sm:w-[23.7rem] w-[22rem] ${forgotResult === null || forgotResult.status === "fail" ? "h-[30rem]" : "h-[32rem]"}  gap-4`}>
                    {!loading ? <><div className="w-full flex justify-center mt-10">
                        <ForgetPassword />
                    </div>
                        <h1 className="font-semibold text-[18px]">Trouble with logging in?</h1>
                        <p className="text-center mx-[1.4rem] text-[15px] text-[#A8A8A8]">{forgotResult === null || forgotResult.status === "fail" ? "Enter your email address, phone number or username, and we'll send you a link to get back into your account." : "Enter the verification code sent to your email."}</p>
                        <div className="flex flex-col gap-2 border-b-[1px] border-[#262626] pb-3.5">
                            {forgotResult === null || forgotResult.status === "fail" ? <>
                                {forgotForm.map((item, index) => (
                                    <InputLabel key={index} onChange={item.onChange} value={item.value} text={item.text} type={item.type} />
                                ))}
                                <button onClick={forgotPassword} className="my-3 bg-[#0094f4] py-1.5 hover:opacity-60 transition duration-200 rounded-lg">Send Reset Code</button></>
                                :
                                <>
                                    {resetForm.map((item, index) => (
                                        <InputLabel key={index} onChange={item.onChange} value={item.value} text={item.text} type={item.type} />
                                    ))}
                                    <button onClick={resetPassword} className="my-3 bg-[#0094f4] py-1.5 hover:opacity-60 transition duration-200 rounded-lg">Change Password</button></>
                            }
                            <div className="relative">
                                <h2 className="absolute z-[20] left-1/2 -translate-x-1/2 -top-[0.5rem] bg-[#000] p-3 text-[13px] rounded-full text-[#A8A8A8]">OR</h2>
                            </div>
                        </div>
                        <Link to="/signup" className="font-semibold mt-2 hover:opacity-70 transition-opacity duration-300">Create New Account</Link>
                    </> : <div className="mt-10"><Loader /></div>}
                </div>
                {forgotResult?.status === "fail" && <p className="text-red-500">{forgotResult.data}</p>}
                <div className="flex items-center justify-center border-[2px] border-[#363636] py-6 sm:w-[23.7rem] w-[22rem] gap-1">
                    <p>Have an account?</p>
                    <Link to="/login" className="text-[#3897F1]">Log in</Link>
                </div>
            </div>
        </section >
        <Footer />
    </div >
}