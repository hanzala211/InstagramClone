import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LeftArrow, StorySVG } from "../assets/Constants";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export function Archive() {
    const navigate = useNavigate()
    const { userData, setArchives, setLoadingArchives } = useUser()
    useEffect(() => {
        async function fetchArchive() {
            try {
                setLoadingArchives(true);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/archives`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow"
                })
                const result = await response.json();
                setArchives(result.archives);
            } catch (error) {
                console.error(error)
            } finally {
                setLoadingArchives(false)
            }
        }
        fetchArchive()
    }, [])
    return <>
        <section className="w-full max-w-[75%] grid grid-rows-[22vh,auto] gap-10 mx-auto">
            <div className="relative mt-7 border-b-[1px] border-[#262626]">
                <Link onClick={() => navigate(-1)} className="flex gap-2 w-[6rem] items-center">
                    <LeftArrow />
                    <h2 className="text-[20px]">Archive</h2>
                </Link>
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