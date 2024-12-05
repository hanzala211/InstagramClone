import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { ReportIcon, SaveIcon } from "../../assets/Constants"

export function LogOutDiv({ isOpen, dropdownRef, isMobile }) {
    const { setMainLoading, setUserData, userData } = useUser()

    const moreArr = [
        {
            icon: <SaveIcon />,
            title: "Saved",
            to: `/${userData.data.user.userName}/saved/`
        },
        {
            icon: <ReportIcon />,
            title: "Report",
        }
    ]
    return <>
        {
            isOpen && <div className={`absolute bg-[#262626] w-full md:max-w-[12%] max-w-[70%] z-[300] modal rounded-[1rem] ${isMobile ? "top-8 left-16 440:left-24" : "bottom-20 left-8"}`} ref={dropdownRef} >
                <div className="border-b-[4px] border-[#353535] px-2 py-3">
                    {moreArr.map((item, i) => (
                        <Link
                            key={i}
                            to={item.to}
                            className="gap-4 items-center py-3 group w-full hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-2 rounded-md"
                        >
                            {item.icon}
                            <p className="text-[15px]">{item.title}</p>
                        </Link>
                    ))}
                </div>
                <div className="px-2 py-2.5">
                    <Link
                        to="/login"
                        className="gap-4 items-center group w-full py-3 hover:bg-[rgba(255,255,255,.1)] transition duration-300 inline-flex p-4 rounded-md"
                        onClick={() => {
                            setMainLoading(true)
                            setUserData([])
                            localStorage.removeItem("token")
                            setTimeout(() => {
                                window.location.reload();
                            }, 500)
                        }}
                    >
                        <p className="text-[14px]">Log out</p>
                    </Link>
                </div>
            </div>
        }
    </>
}