import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LeftArrow, StorySVG } from "../assets/Constants";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { fetchArchive } from "../services/archive";

export function Archive() {
    const { userData, setArchives, setLoadingArchives } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        fetchArchive(setLoadingArchives, userData, setArchives)
    }, [])

    return <>
        <section className="w-full lg:max-w-[75%] grid grid-rows-[22vh,auto] gap-10 mx-auto">
            <div className="relative mt-7 border-b-[1px] border-[#262626]">
                <button onClick={() => navigate(-1)} className="flex gap-2 ml-3 md:ml-0 w-[6rem] items-center cursor-pointer">
                    <LeftArrow />
                    <h2 className="text-[20px]">Archive</h2>
                </button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <NavLink to="/archive/stories/" className={({ isActive }) => `flex gap-2 pb-3 font-semibold text-[13px] items-center ${isActive ? "border-b-[1px]" : ""}`}>
                        <StorySVG />
                        STORIES
                    </NavLink>
                </div>
            </div>
            <div className="flex flex-col pb-28 items-center justify-center text-center">
                <Outlet />
            </div>
        </section>
    </>
}