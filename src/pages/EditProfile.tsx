import { useEffect, useRef, useState } from "react";
import { ProfileSettingInput } from "../components/profile/ProfileSettingInput";
import { Loader } from "../components/helpers/Loader";
import { EditForm } from "../types/user";
import { useAuth } from "../context/AuthContext";
import { profileDataChange, profilePicChange } from "../services/profile";

interface InitialData {
    userName: string;
    bio: string;
    selectedImage?: any;
}

export const EditProfile: React.FC = () => {
    const { setUserData, userData, token } = useAuth();
    const [selectedImage, setSelectedImage] = useState<null | string>(null);
    const [changeUserName, setChangeUserName] = useState<string>(userData.data.user.userName);
    const [changeBio, setChangeBio] = useState<string>(userData.data.user.bio)
    const [initialData, setInitialDate] = useState<InitialData>({
        userName: userData.data.user.userName,
        bio: userData.data.user.bio,
    });
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const fileInputRef = useRef<any>(null);

    const isChanged =
        changeUserName !== initialData.userName ||
        changeBio !== initialData.bio ||
        selectedImage !== null;

    useEffect(() => {
        setInitialDate({
            userName: userData.data.user.userName,
            bio: userData.data.user.bio,
            selectedImage: null
        })
    }, [userData.data.user.userName, userData.data.user.bio])

    function handleClick() {
        fileInputRef.current.click();
    }

    function handleFileChange(event: any) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(URL.createObjectURL(file));
        }
        fileInputRef.current.value = null;
    }

    const changeData = async () => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            setIsDisabled(true);
            const res = await profileDataChange({
                token,
                raw: {
                    userName: changeUserName,
                    fullName: userData?.data.user.fullName,
                    websiteUrl: userData?.data.user.websiteUrl,
                    gender: "Male",
                    bio: changeBio
                }
            })
            console.log(res)
            if (res.message === 'Profile updated successfully') {
                setSuccessMessage(res.message);
                setUserData((prev: any) => {
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            user: {
                                ...res.data,
                            },
                        },
                    };
                });
            } else {
                setErrorMessage(res.message);
            }
            if (selectedImage !== null) {
                const changeProfile = await profilePicChange({
                    token,
                    selectedImage
                })
                if (changeProfile.message === 'Profile picture updated successfully') {
                    setUserData((prev: any) => {
                        return {
                            ...prev,
                            data: {
                                ...prev.data,
                                user: {
                                    ...prev.data.user,
                                    profilePic: changeProfile.profilePic,
                                },
                            },
                        };
                    });
                } else {
                    setErrorMessage(changeProfile.data);
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsDisabled(false);
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 900);
        }
    }

    const editForm: EditForm[] = [{
        heading: "Username",
        maxLength: 30,
        minLength: 3,
        value: changeUserName,
        onChange: (e) => setChangeUserName(e.target.value)
    },
    {
        heading: "Bio",
        maxLength: 50,
        minLength: 10,
        value: changeBio,
        onChange: (e) => setChangeBio(e.target.value)
    },
    ]

    return <section className="w-full xl:max-w-[54%] 1280:max-w-[40%] lg:max-w-[60%] md:max-w-[80%] max-w-[95%] mt-8 md:mt-0 h-[80vh] mx-auto relative">
        <h2 className="text-[25px] font-semibold">Edit Profile</h2>
        <div className="flex flex-row items-center justify-between bg-[#424242] rounded-2xl my-5 px-2 md:px-4 py-2 md:gap-0 gap-2 w-full">
            <div className="flex md:gap-4 gap-2 items-center">
                <img src={`${selectedImage === null ? userData?.data?.user?.profilePic : selectedImage}`} className="rounded-full md:w-20 md:h-20 w-16 h-16 md:min-w-[5rem] min-w-[4rem] object-cover" alt="User Profile" />
                <div className="flex flex-col">
                    <p className="font-semibold">{userData?.data?.user?.userName}</p>
                    <p className="text-[#A8A8A8] text-[15px]">{userData?.data?.user?.fullName}</p>
                </div>
            </div>
            <button onClick={handleClick} className="bg-[#0095F6] hover:bg-opacity-70 w-full max-w-[45%] lg:max-w-[30%] 1280:max-w-[30%] transition-all duration-200 px-2 py-2 text-[14px] rounded-lg">Change Photo</button>
            <input type="file" accept="image/" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        </div>
        {editForm.map((item, i) => (
            <ProfileSettingInput item={item} key={i} />
        ))}
        {errorMessage !== "" && <p className="mt-4 ml-1 text-red-600">{errorMessage}</p>}
        {successMessage !== "" && <p className="text-green-500 mt-4 ml-1">{successMessage}</p>}
        <div className="mt-5">
            <button
                onClick={() => changeData(changeUserName, userData, setErrorMessage, setSuccessMessage, setIsDisabled, changeBio, setUserData, selectedImage)}
                className={`w-full py-3 rounded-xl bg-[#0095F6] text-white ${!isChanged ? "opacity-50 cursor-not-allowed" : "opacity-100"} absoluteBtn ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={!isChanged || isDisabled} >
                Save Changes
                {isDisabled && <div className="absolute z-[10000] w-10 -top-44 left-1/2 -translate-x-1/2">
                    <Loader />
                </div>}
            </button>
        </div>
    </section>
}