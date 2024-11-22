import { PlusIcon } from "../assets/Constants";

export function HighLights({ title, image, onClick }) {
    return <div className="relative cursor-pointer" onClick={onClick}>
        <div className="w-full rounded-full p-1 border-[2px] border-[#1F1F1F]">
            <div className="rounded-full bg-[#121212] max-w-full flex items-center justify-center px-5 py-5">{image !== undefined ? <img src={image} className="rounded-full object-cover scale-[1.7] w-10 h-10" alt={title} /> : <PlusIcon />}</div>
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 mt-2 text-[14px]">{title}</p>
    </div>;
}