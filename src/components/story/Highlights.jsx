import { PlusIcon } from "../../assets/Constants";

export function HighLights({ title, image, onClick }) {
    return <div className="relative cursor-pointer" onClick={onClick}>
        <div className="rounded-full md:w-full w-[4rem] p-1 border-[2px] md:h-[6rem] h-[4rem] border-[#1F1F1F]">
            <div className="rounded-full bg-[#121212] md:h-auto h-full flex items-center justify-center p-5">{image !== undefined ? <img src={image} className="rounded-full object-cover scale-[1.7] w-10 h-10" alt={title} /> : <PlusIcon className="scale-[2.5] md:scale-105" />}</div>
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 mt-2 text-[14px]">{title}</p>
    </div>;
}