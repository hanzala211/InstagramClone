import { AuthContextType, ContextChild } from "../types/contextTypes";
import { createContext, useContext, useEffect, useState } from "react";
import { User, UserInfo } from "../types/user";
import { forgot, login, me, reset, signup } from "../services/userAuth"
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<ContextChild> = ({ children }) => {
    const [userData, setUserData] = useState<User | null>(null)
    const [selectedProfile, setSelectedProfile] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null)
    const [userValue, setUserValue] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>('')
    const [fullName, setFullName] = useState<string>("")
    const [mainLoading, setMainLoading] = useState<boolean>(true);
    const [succesMessage, setSuccessMessage] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [forgotResult, setForgotResult] = useState<any>(null)
    const [codeValue, setCodeValue] = useState<string>("")
    const navigate = useNavigate()

    const fetchLogin = async () => {
        try {
            setLoading(true)
            const res = await login({
                identifier: userValue,
                password: password
            });
            setUserData(res);
            if (res && res.status === 'success' && res.data) {
                setMainLoading(true);
                setUserValue('');
                setPassword('');
                setDoc(doc(db, 'users', `${res.data.user._id}`), {
                    userName: `${res.data.user.userName}`,
                    id: `${res.data.user._id}`,
                });
                navigate('/home');
                localStorage.setItem('token', JSON.stringify(res.data.token));
                setToken(res.data.token)
            }
        } catch (error) {
            setUserData({
                status: 'fail',
                data: 'Server Is Down.Please try after sometime',
                error: error,
            });
        } finally {
            setMainLoading(false);
            setLoading(false);
        }
    }

    const fetchSignup = async () => {
        try {
            setMainLoading(true);
            setLoading(true);
            setUserData(null);
            setSuccessMessage('');
            const res = await signup({
                fullName: fullName,
                email: email,
                userName: userValue,
                password: password
            });
            setUserData(res);
            if (res.status === 'success') {
                setEmail('');
                setPassword('');
                setFullName('');
                setUserValue('');
                navigate('/home');
                setDoc(doc(db, 'users', `${res.data.user._id}`), {
                    userName: `${res.data.user.userName}`,
                    id: `${res.data.user._id}`,
                });
                localStorage.setItem('token', JSON.stringify(res.data.token));
                setSuccessMessage(res.status);
                setToken(res.data.token)
            }
        } catch (error) {
            setUserData({
                status: 'fail',
                data: 'Server Is Down.Please try after sometime',
                error: error,
            });
        } finally {
            setLoading(false);
            setMainLoading(false);
        }
    }

    const fetchMe = async (localitem: string | null) => {
        try {
            setMainLoading(true);
            setUserData(null);
            const res = await me({ token: localitem })
            if (res.status !== "success") {
                navigate("/login")
            }
            setUserData({
                status: res.status,
                data: {
                    token: localitem,
                    user: {
                        ...res.data,
                    },
                },
            });
        } catch (error) {
            console.error(error);
            navigate("/login")
            setMainLoading(false)
        }
    }

    const forgotPassword = async () => {
        try {
            setLoading(true)
            const res = await forgot({ email: email })
            setForgotResult(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const resetPassword = async () => {
        try {
            setLoading(true)
            const res = await reset({
                email: email,
                forgotPasswordCode: codeValue,
                newPassword: password,
            })
            if (res.status === 'success') {
                navigate('/login');
                setPassword("")
                setEmail("")
                setCodeValue("")
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <AuthContext.Provider value={{
        userData, setUserData, token, setToken, userValue, setUserValue, password, setPassword, mainLoading, setMainLoading, loading, setLoading, fetchLogin, fetchSignup, succesMessage, setSuccessMessage, fullName, setFullName, email, setEmail, forgotResult, setForgotResult, codeValue, setCodeValue, forgotPassword, resetPassword, selectedProfile, setSelectedProfile, fetchMe
    }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useUser")
    }
    return context;
}

