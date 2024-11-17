import { Link } from "react-router-dom"
import { footerArr } from "../assets/Constants"

export function Footer() {
    return <footer className="flex items-center justify-center flex-col gap-3">
        <div className="flex gap-5">{footerArr.map((item, i) => {
            return <Link key={i} className="text-[#A8A8A8] text-[13px] hover:underline">{item}</Link>
        })}
        </div>
        <p className="text-[14px] text-[#A8A8A8]">© 2024 Instagram from Meta</p>
    </footer>
}