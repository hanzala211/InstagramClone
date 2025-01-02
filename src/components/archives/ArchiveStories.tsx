import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext";
import { ShadCnSkeleton } from "../ui/shadcnSkeleton";

export const ArchiveStories: React.FC = () => {
    const { archives, loadingArchives, setCurrentStory } = useUser()

    function formatDate(num: string) {
        const date = new Date(num);
        const day = date.getDate();
        return `${day}`
    }

    function formatMonth(num: string) {
        const date = new Date(num);
        const month = date.toLocaleString('default', { month: "short" });
        return `${month} `
    }

    return <>
        {!loadingArchives ?
            <div className="grid md:grid-cols-4 grid-cols-2 px-2 md:px-0 gap-5 relative">
                {archives !== undefined && archives.length > 0 ? archives.map((item: any, i: number, arr: any[]) => {
                    return <Link to={`/stories/archive/${arr[i]._id}/`} key={i} className="relative rounded-lg hover:scale-105 transition-all duration-300" onClick={() => setCurrentStory(i)}>
                        <img src={item.imageUrl} alt="Story Image" className="w-96 rounded-lg" />
                        <p className="bg-white text-black w-12 absolute top-2 left-2 rounded-xl text-center font-semibold text-[18px] ">{formatDate(item?.createdAt)} <p className="text-black font-light text-[15px]">{formatMonth(item?.createdAt)}</p></p>
                    </Link>
                }) : <div className="text-[#8e8e8e] h-[63vh] lg:translate-x-[25vw] translate-x-[40vw]">
                    <p>No items found in this archive.</p>
                    <p>Start adding some stories to see them here!</p>
                </div>}
            </div>
            : <div className="grid md:grid-cols-4 grid-cols-2 w-full max-w-[100%] px-2 md:px-0 gap-5">
                {Array.from({ length: 24 }, (item, i) => (
                    <ShadCnSkeleton key={i} className="w-full xl:h-[26rem] sm:h-[38rem] md:h-[19rem] h-[18rem] rounded-md max-w-full bg-[#262626] " />
                ))}
            </div>}
    </>
}