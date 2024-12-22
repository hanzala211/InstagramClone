import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useHome } from "../../context/HomeContext";
import { useSearch } from "../../context/SearchContext";

export function HomeStories() {
    const { homeStories } = useHome()
    const { setSearchUserStatus, setSelectedProfile } = useSearch()

    return <div className="w-full lg:max-w-[45%] max-w-[100%] px-1 border-b-[2px] border-[#363636] md:border-[0] pb-2 mt-[3.8rem] md:mt-5 mx-auto relative">
        <Carousel>
            <CarouselContent className="flex md:gap-5 gap-3">
                {homeStories.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-0.5">
                        <Link to={`/search/stories/${item.user.userName}/${item.user.stories[0]._id}/`} className="block rounded-full relative w-20 multicolor-border"
                            onClick={() => {
                                setSearchUserStatus(item.user.stories)
                                setSelectedProfile(item.user)
                            }}
                        >
                            <img src={item.user.profilePic} className="rounded-full w-20 h-20 p-1.5" alt="Stories Picture" />
                        </Link>
                        <p className="text-[#A8A8A8] text-[13px] text-center font-semibold">{item.user.fullName}</p>
                    </div>
                ))}
            </CarouselContent>
            {homeStories.length > 9 && <><CarouselPrevious />
                <CarouselNext /></>}
        </Carousel>
    </div >
}