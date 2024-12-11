import { useEffect, useState } from "react";
import { useSearch, useUser } from "../../context/UserContext";
import { Skeleton } from "../helpers/Skeleton";
import { UserModal } from "../usermodals/UserModal";
import { useLocation } from "react-router-dom";
import { fetchSearch } from "../../services/search";

export function SearchBox({ refere, isSearching }) {
    const { userData } = useUser()
    const { searchQuery, setSearchQuery, searchData, setSearchData, setSelectedProfile } = useSearch();
    const [searchLoading, setSearchLoading] = useState(false);
    const location = useLocation()

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (searchQuery.length > 0) {
            setSearchLoading(true);
            fetchSearch(signal, setSearchData, searchQuery, userData, setSearchLoading);
        } else if (searchQuery.length === 0) {
            setSearchLoading(false)
            setSearchData([]);
        }
        return () => abortController.abort();
    }, [searchQuery])

    return <div ref={refere} className={`fixed ${location.pathname.slice(0, 7) === "/direct" ? "bg-[#000] left-20" : "bg-[#000] xl:bg-transparent lg:left-32"} md:left-20 xl:left-20 top-0 h-[100vh] transition-[width] overflow-auto scrollbar-hidden duration-300 ease-in-out ${!isSearching ? "w-0 pointer-events-none" : "border-r-[1px] border-[#262626] sm:w-[30vw] lg:w-[23rem]"}`}>
        <div className={`px-4 pt-9 pb-6 flex gap-9 flex-col ${!isSearching ? "hidden" : "border-b-[1px] border-[#262626]"}`}>
            <h2 className="font-semibold text-[25px]">Search</h2>
            <input type="text" placeholder="Search" className="bg-[#363636] px-3 py-2.5 w-full rounded-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="py-3 px-3">
            <div className="flex flex-col gap-2">
                {searchLoading ? Array.from(({ length: 30 }), (_, i) => <div key={i} className="ml-3 mt-5"><Skeleton /></div>) : searchData.map((item, i) => {
                    return <UserModal key={i} item={item} isSearchModal={true} setSelectedProfile={setSelectedProfile} />
                })}
            </div>
        </div>
    </div>
}