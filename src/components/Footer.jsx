import { Link } from "react-router-dom"
import { footerArr } from "../assets/Constants"

export function Footer() {
    return <footer className="flex items-center justify-center flex-col gap-3 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex gap-5 flex-wrap justify-center sm:gap-4 md:gap-6">
            {footerArr.map((item, i) => {
                return <Link key={i} className="text-[#A8A8A8] text-[13px] hover:underline">{item}</Link>
            })}
        </div>
        <p className="text-[12px] sm:text-[14px] text-[#A8A8A8] mt-2">© 2024 Instagram from Meta</p>
    </footer>

}