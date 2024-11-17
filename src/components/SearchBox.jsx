import { useEffect } from "react";
import { useSearch } from "../context/UserContext";
import { Skeleton } from "./Skeleton";

export function SearchBox({ refere, isSearching }) {
    const { searchQuery, setSearchQuery, searchData, setSearchData } = useSearch();
    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;
        const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/search_users?search_query=${searchQuery}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '096a25c359msh70e2224e7c8e258p11401ajsn6fb8a6b37e32',
                'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
            }
        };
        if (searchQuery === "") {
            setSearchData([]);
        }
        if (searchQuery.length > 0) {
            async function fetchSearch() {
                try {
                    const response = await fetch(url, { ...options, signal });
                    const result = await response.json();
                    const fetchImagesInOrder = async () => {
                        try {
                            const imagePromises = result?.data?.items.map(async (item) => {
                                const response = await fetch(`https://cors-anywhere.herokuapp.com/${item.profile_pic_url}`, {
                                    method: 'GET',
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                    }
                                });
                                const blob = await response.blob();
                                return URL.createObjectURL(blob);
                            });
                            const images = await Promise.all(imagePromises);
                            result.data.items.map((item, i) => {
                                setSearchData((prev) => [...prev, { ...item, url: images[i] }])
                            })
                        } catch (error) {
                            console.error('Error loading images:', error);
                        }
                    };
                    fetchImagesInOrder();
                } catch (error) {
                    console.error(error);
                }
            }
            fetchSearch();
        }
        return () => { abortController.abort(); };
    }, [searchQuery])
    return <div ref={refere} className={`fixed pl-2 left-16 top-0 h-[100vh] transition-[width] duration-300 ${!isSearching ? "w-0 pointer-events-none" : "border-r-[1px] border-[#262626] w-[19vw] "}`}>
        <div className={`px-4 pt-9 pb-6 flex gap-9 flex-col ${!isSearching ? "hidden" : "border-b-[1px] border-[#262626]"}`}>
            <h2 className="font-semibold text-[25px]">Search</h2>
            <input type="text" placeholder="Search" className="bg-[#363636] px-3 py-2.5 w-full rounded-lg outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div>
            <div className={`px-4 pt-4 ${!isSearching || searchQuery.length > 0 ? "hidden" : ""}`}>
                <h2 className="font-semibold">Explore Results</h2>
                <p className="text-sm text-gray-500">Type to find what you're looking for...</p>
            </div>
            {searchQuery.length > 0 && Array.from(({ length: 10 }), (_, i) => <Skeleton key={i} />)}
        </div>
    </div>
}