import { IoCloseSharp } from "react-icons/io5";

export function Overlay({ handleClose, isPostOpen }) {
    return <>
        <IoCloseSharp
            className={`fixed xl:text-[35px] text-[25px] xl:top-8 lg:top-5 top-12 xl:right-7 lg:right-5 right-2 z-[100000] cursor-pointer opacity-0 ${isPostOpen ? "opacity-100" : "pointer-events-none"}`}
            onClick={handleClose}
        />
        <div
            className={`overlay z-[100] opacity-0 transition-all duration-500 ${!isPostOpen ? "pointer-events-none" : "backdrop-blur-sm opacity-100"
                }`}
            onClick={handleClose}
        ></div>
    </>
}