export function Skeleton({ width }) {
    return <div className="flex items-center space-x-2 max-w-xs w-full">
        <div className={`${width ? "md:w-[4.5rem] md:h-14 w-12 h-12 md:mx-0 mx-6" : "w-12 h-10"} bg-gray-400 rounded-full animate-pulse`}></div>
        <div className="md:flex flex-col space-y-2 w-full hidden">
            <div className="h-4 bg-gray-400 rounded animate-pulse w-[90%]"></div>
            <div className="h-4 bg-gray-400 rounded animate-pulse w-[70%]"></div>
        </div>
    </div>
}