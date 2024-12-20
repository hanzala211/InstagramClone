import { useLocation } from "react-router-dom";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";
import { ImageContainer } from "../components/ui/ImageContainer";
import { usePost } from "../context/PostContext";

export function CaptionMobileCreator() {
    const { captionValue, setCaptionValue, croppedImages } = usePost()
    const location = useLocation()

    return <section className="mt-12">
        <PostPageHeader isArrowNeeded={true} isDetails={true} isCreating={location.pathname.split("/")[1] === "create"} />
        <div className="flex items-end">
            <textarea className="bg-transparent md:h-[10rem] h-[7rem] text-white outline-none resize-none w-[75%] pt-5 mt-1 md:text-[16px] px-3 text-[12px] " maxLength={100} value={captionValue} placeholder="Write a Caption" onChange={(e) => setCaptionValue(e.target.value)}></textarea>
            <ImageContainer images={croppedImages} />
        </div>
    </section>
}