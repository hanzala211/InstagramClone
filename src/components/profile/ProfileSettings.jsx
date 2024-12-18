import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Loader } from "../helpers/Loader";
import { Overlay } from "../helpers/Overlay";
import { changeData } from "../../services/profile";

export function ProfileSettings({ userData, isEditOpen, setIsEditOpen }) {
    const { setUserData } = useUser();
    const [selectedImage, setSelectedImage] = useState(null);
    const [changeUserName, setChangeUserName] = useState(userData.data.user.userName);
    const [changeBio, setChangeBio] = useState(userData.data.user.bio)
    const [isPublic, setIsPublic] = useState(!userData.data.user.isPublic);
    const [initialData, setInitialDate] = useState({
        userName: userData.data.user.userName,
        bio: userData.data.user.bio,
        public: !userData.data.user.isPublic,
    });
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const fileInputRef = useRef(null);

    const isChanged =
        changeUserName !== initialData.userName ||
        changeBio !== initialData.bio ||
        isPublic !== initialData.public ||
        selectedImage !== null;

    useEffect(() => {
        setInitialDate({
            userName: userData.data.user.userName,
            bio: userData.data.user.bio,
            public: !userData.data.user.isPublic,
            selectedImage: null
        })
    }, [userData.data.user.userName, userData.data.user.bio, userData.data.user.isPublic])

    function handleClick() {
        fileInputRef.current.click();
    }

    function handleClose() {
        setIsEditOpen(false)
        setTimeout(() => {
            setSelectedImage(null);
            setErrorMessage("");
            setChangeBio(userData.data.user.bio)
            setChangeUserName(userData.data.user.userName)
            setIsPublic(!userData.data.user.isPublic)
            setSuccessMessage("");
        }, 600)
        setInitialDate({
            userName: userData.data.user.userName,
            bio: userData.data.user.bio,
            public: !userData.data.user.isPublic,
        })
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(URL.createObjectURL(file));
        }
        fileInputRef.current.value = null;
    }

    return <>
        <Overlay handleClose={handleClose} isPostOpen={isEditOpen} />
        <div className={`fixed flex items-center left-1/2 -translate-x-1/2 top-[48%] md:top-1/2 -translate-y-1/2 justify-center z-[150] w-full md:max-w-[45rem] md:h-[75vh] 440:max-w-[25rem] max-w-[23rem] h-[75vh] transition-opacity duration-500 ${isEditOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            <div className="bg-[#262626] w-full h-full overflow-auto scrollbar-hidden md:rounded-3xl rounded-xl px-5 md:px-10 md:py-10 py-6">
                <h2 className="text-[25px] font-semibold">Edit Profile</h2>
                <div className="flex flex-row items-center justify-between bg-[#424242] rounded-2xl my-5 px-2 md:px-4 py-2 w-full">
                    <div className="flex gap-4 items-center">
                        <img src={`${selectedImage === null ? userData.data.user.profilePic : selectedImage}`} className="rounded-full md:w-20 md:h-20 w-16 h-16 min-w-[1rem] object-cover" alt="User Profile" />
                        <div className="flex flex-col">
                            <p className="font-semibold">{userData.data.user.userName}</p>
                            <p className="text-[#A8A8A8] text-[15px]">{userData.data.user.fullName}</p>
                        </div>
                    </div>
                    <button onClick={handleClick} className="bg-[#0095F6] hover:bg-opacity-70 transition-all duration-200 px-2 py-2 text-[14px] rounded-lg">Change Photo</button>
                    <input type="file" accept="image/" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
                </div>
                <div>
                    <h3 className="text-[20px] font-semibold">User Name</h3>
                    <input type="text" placeholder="Username" maxLength={30} minLength={3} className="w-full py-3 px-4 bg-[#424242] outline-none mt-2 rounded-xl" value={changeUserName} onChange={(e) => setChangeUserName(e.target.value)} />
                    <p className="text-[#A8A8A8] text-[15px] mt-2 ml-1">Please keep responses within 30 characters.</p>
                </div>
                <div>
                    <h3 className="text-[20px] font-semibold mt-3">Bio</h3>
                    <textarea type="text" placeholder="Bio" minLength={10} maxLength={50} className="w-full py-3 px-4 bg-[#424242] outline-none mt-2 rounded-xl resize-none" value={changeBio} onChange={(e) => setChangeBio(e.target.value)} />
                    <p className="text-[#A8A8A8] text-[15px] mt-2 ml-1">Please keep responses within 50 characters.</p>
                </div>
                <div>
                    <h3 className="text-[20px] mb-2 ml-1 font-semibold mt-4">Private</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="private"
                            className="w-5 h-5 ml-1 bg-[#424242] rounded-md border-[#262626] focus:ring-2 focus:ring-[#0095F6] transition-colors duration-200"
                            checked={isPublic}
                            onChange={(e) => {
                                setIsPublic(e.target.checked)
                            }}
                        />
                        <label htmlFor="private" className="text-[#A8A8A8] text-[15px]">
                            Mark your profile as private
                        </label>
                    </div>
                    <p className="text-[#A8A8A8] text-[15px] mt-3 ml-1">
                        Toggle to make your profile private and hide content from others.
                    </p>
                    {errorMessage !== "" && <p className="mt-4 ml-1 text-red-600">{errorMessage}</p>}
                    {successMessage !== "" && <p className="text-green-500 mt-4 ml-1">{successMessage}</p>}
                </div>
                <div className="mt-5">
                    <button
                        onClick={() => changeData(changeUserName, userData, setErrorMessage, setSuccessMessage, setIsDisabled, changeBio, isPublic, setUserData, selectedImage, setIsEditOpen)}
                        className={`w-full relative py-3 rounded-xl bg-[#0095F6] text-white ${!isChanged ? "opacity-50 cursor-not-allowed" : "opacity-100"} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                        disabled={!isChanged || isDisabled} >
                        Save Changes
                        {isDisabled && <div className="absolute z-[10000] w-10 -top-44 left-1/2 -translate-x-1/2 ">
                            <Loader />
                        </div>}
                    </button>
                </div>
            </div>
        </div></>
}