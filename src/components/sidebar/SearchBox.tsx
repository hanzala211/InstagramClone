import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Skeleton } from "../helpers/Skeleton";
import { UserModal } from "../usermodals/UserModal";
import { useLocation } from "react-router-dom";
import { fetchSearch } from "../../services/search";
import { useSearch } from "../../context/SearchContext";

interface SearchBoxProps{
    refere?: any;
    isSearching?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ refere, isSearching }) => { 
    const { userData } = useUser();
    const { searchQuery, setSearchQuery, searchData, setSearchData, setSelectedProfile } = useSearch();
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        if (searchQuery) {
            setSearchLoading(true);
            fetchSearch(signal, setSearchData, searchQuery, userData, setSearchLoading);
        } else {
            setSearchLoading(false);
            setSearchData([]);
        }

        return () => abortController.abort();
    }, [searchQuery, userData, setSearchData]);

    return (
        <div ref={refere} className={`fixed top-0 h-[100vh] transition-[width] overflow-auto scrollbar-hidden duration-300 ease-in-out ${location.pathname.startsWith("/direct") ? "lg:left-20 md:left-20 xl:left-20 bg-[#000]" : "bg-[#000] left-20 lg:left-20"
            } ${isSearching ? "border-r-[1px] border-[#262626] sm:w-[30vw] lg:w-[24rem] opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>
            <div className={`px-4 pt-9 pb-6 flex gap-9 flex-col ${!isSearching ? "hidden" : "border-b-[1px] border-[#262626]"}`}>
                <h2 className="font-semibold text-[25px]">Search</h2>
                <input
                    type="text"
                    placeholder="Search"
                    className={"bg-[#363636] px-3 py-2.5 w-full rounded-lg outline-none"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="py-3 px-3">
                <div className="flex flex-col gap-2">
                    {searchLoading ? (
                        Array.from({ length: 30 }, (_, i) => (
                            <div key={i} className="ml-3 mt-5">
                                <Skeleton />
                            </div>
                        ))
                    ) : (
                        searchData.map((item, i) => (
                            <UserModal key={i} item={item} isSearchModal={true} setSelectedProfile={setSelectedProfile} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
