export const FullSkeleton: React.FC = () => {
    return <div>
        <div className="flex items-center space-x-2 max-w-xs w-full px-2 py-4">
            <div className="w-12 h-10 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="flex flex-col space-y-2 w-full">
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[70%]"></div>
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[50%]"></div>
            </div>
        </div>
        <div className="flex justify-evenly mt-4">
            <div className="w-full flex flex-col items-center gap-1">
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[27%]"></div>
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[40%]"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[27%]"></div>
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[40%]"></div>
            </div>
            <div className="w-full gap-1 flex flex-col items-center">
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[27%]"></div>
                <div className="h-4 bg-gray-400 rounded animate-pulse w-[40%]"></div>
            </div>
        </div>
        <div className="flex gap-1 mt-[2.2rem]">
            <div className="h-24 bg-gray-400 rounded animate-pulse w-[33%]"></div>
            <div className="h-24 bg-gray-400 rounded animate-pulse w-[33%]"></div>
            <div className="h-24 bg-gray-400 rounded animate-pulse w-[33%]"></div>
        </div>
    </div>
}