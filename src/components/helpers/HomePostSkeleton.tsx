import { ShadCnSkeleton } from "../ui/shadcnSkeleton"

export const HomePostSkeleton = () => {
    return <div className="flex gap-2 flex-col">
        <div className="flex gap-3 items-center">
            <ShadCnSkeleton className="h-10 rounded-full w-10 bg-[#262626]" />
            <ShadCnSkeleton className="h-3 w-full max-w-[15%] bg-[#262626] rounded-md" />
        </div>
        <ShadCnSkeleton className="w-full rounded-md max-w-full bg-[#262626] lg:h-[25rem] xl:h-[40rem] md:h-[40rem] sm:h-[35rem] h-[25rem]" />
        <div className="flex flex-col items-center gap-2">
            <ShadCnSkeleton className="h-3 w-full max-w-[95%] bg-[#262626] rounded-md" />
            <ShadCnSkeleton className="h-3 w-full max-w-[95%] bg-[#262626] rounded-md" />
        </div>
    </div>
}