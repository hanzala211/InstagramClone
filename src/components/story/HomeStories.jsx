import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";

export function HomeStories() {

    return <div className="w-full md:max-w-[45%] max-w-[96%] mt-14 md:mt-5 mx-auto relative">
        <Carousel>
            <CarouselContent className="flex md:gap-5 gap-3">
                <div className="flex flex-col items-center gap-0.5">
                    <Link className="block rounded-full relative w-16 multicolor-border">
                        <img src="images/testUser.jpg" className="rounded-full w-16 h-16 p-1.5" alt="Stories Picture" />
                    </Link>
                    <p className="text-[#A8A8A8] text-[13px] font-semibold">Hanzala</p>
                </div>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div >
}