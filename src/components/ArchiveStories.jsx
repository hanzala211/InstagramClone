import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { Loader } from "./Loader";

export function ArchiveStories() {
    const { archives, loadingArchives, setCurrentStory } = useUser()

    function formatDate(num) {
        const date = new Date(num);
        const day = date.getDate();
        return `${day}`
    }

    function formatMonth(num) {
        const date = new Date(num);
        const month = date.toLocaleString('default', { month: "short" });
        return `${month} `
    }

    return <>
        {!loadingArchives ?
            <div className="grid grid-cols-4 gap-5">
                {archives !== undefined && archives.length > 0 ? archives.map((item, i, arr) => {
                    return <Link to={`/stories/archive/${arr[i]._id}/`} key={i} className="relative rounded-lg hover:scale-105 transition-all duration-300" onClick={() => setCurrentStory(i)}>
                        <img src={item.imageUrl} alt="Story Image" className="w-96 rounded-lg" />
                        <p className="bg-white text-black w-12 absolute top-2 left-2 rounded-xl text-center font-semibold text-[18px] ">{formatDate(item.createdAt)} <p className="text-black font-light text-[15px]">{formatMonth(item.createdAt)}</p></p>
                    </Link>
                }) : <div className="text-[#8e8e8e] h-[63vh] mx-[28rem] w-full">
                    <p>No items found in this archive.</p>
                    <p>Start adding some stories to see them here!</p>
                </div>}
            </div>
            : <div className="h-[64vh]"><Loader /> </div >}
    </>
}