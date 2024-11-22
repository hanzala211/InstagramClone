import { useEffect, useState } from "react";
import { useSearch, useUser } from "../context/UserContext";
import { Skeleton } from "./Skeleton";
import { Link } from "react-router-dom";

export function SearchBox({ refere, isSearching }) {
    const { userData } = useUser()
    const { searchQuery, setSearchQuery, searchData, setSearchData, setSelectedProfile } = useSearch();
    const [searchLoading, setSearchLoading] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        async function fetchSearch() {
            try {
                setSearchLoading(true)
                setSearchData([]);
                const response = await fetch(`https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/user/search/${searchQuery}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${userData.data.token}`
                    },
                    redirect: "follow",
                    signal
                })
                const result = await response.json();
                if (result.status !== "fail") {
                    setSearchData((prev) => [...prev, ...result.data])
                }
                console.log(result)
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(error)
                }
            } finally {
                setTimeout(() => {
                    setSearchLoading(false);
                }, 1500)
            }
        }
        if (searchQuery.length > 1) {
            fetchSearch();
        } else if (searchQuery.length === 0) {
            setSearchData([]);
        }
        return () => abortController.abort();

    }, [searchQuery])
    return <div ref={refere} className={`fixed pl-2 left-16 top-0 h-[100vh] transition-[width] overflow-auto scrollbar-hidden duration-300 ${!isSearching ? "w-0 pointer-events-none" : "border-r-[1px] border-[#262626] w-[19vw] "}`}>
        <div className={`px-4 pt-9 pb-6 flex gap-9 flex-col ${!isSearching ? "hidden" : "border-b-[1px] border-[#262626]"}`}>
            <h2 className="font-semibold text-[25px]">Search</h2>
            <input type="text" placeholder="Search" className="bg-[#363636] px-3 py-2.5 w-full rounded-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="py-3">
            <div className={`px-4 pt-4 ${!isSearching || searchQuery.length > 0 ? "hidden" : ""}`}>
                <h2 className="font-semibold">Explore Results</h2>
                <p className="text-sm text-gray-500">Type to find what you're looking for...</p>
            </div>
            <div className="flex flex-col gap-2">
                {searchQuery.length > 0 && searchLoading ? Array.from(({ length: 30 }), (_, i) => <div key={i} className="ml-3 mt-5"><Skeleton /></div>) : searchData.map((item, i) => {
                    return <Link to={`/search/${item.userName}/`} key={i} onClick={() => {
                        setSelectedProfile(item)
                    }} className="flex items-center gap-3 px-3 hover:bg-[#626262] hover:bg-opacity-50 py-2 transition-all duration-300">
                        <img src={item.profilePic} alt="ProfileImage" className="w-10 rounded-full" />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-[13px] font-semibold">{item.userName}</p>
                            <p className="text-[#A8A8A8] text-[12px]">{item.fullName}</p>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    </div>
}