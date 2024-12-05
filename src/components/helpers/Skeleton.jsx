export function Skeleton() {
    return <div className="flex items-center space-x-2 max-w-xs w-full">
        <div className="w-12 h-10 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="flex flex-col space-y-2 w-full">
            <div className="h-4 bg-gray-400 rounded animate-pulse w-[90%]"></div>
            <div className="h-4 bg-gray-400 rounded animate-pulse w-[70%]"></div>
        </div>
    </div>
}