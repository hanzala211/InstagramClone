import { Link, useLocation } from "react-router-dom"
import { footerArr } from "../../assets/Constants"

export function Footer() {
    const location = useLocation()
    return <footer className={`items-center justify-center flex-col mt-10 gap-3 px-4 sm:px-6 lg:px-12 xl:px-16 ${location.pathname.slice(0, 7) === "/direct" ? "hidden" : "md:flex hidden"}`}>
        <div className="flex gap-5 flex-wrap justify-center md:gap-4 ">
            {footerArr.map((item, i) => {
                return <Link key={i} className="text-[#A8A8A8] text-[13px] hover:underline">{item}</Link>
            })}
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#A8A8A8] mt-2">© 2024 Instagram from Meta</p>
    </footer>
}