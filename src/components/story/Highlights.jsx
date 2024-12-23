import { PlusIcon } from "../../assets/Constants";

export function HighLights({ title, image, onClick }) {
    return (
        <div className="relative cursor-pointer" onClick={onClick}>
            <div className="w-[4rem] h-[4rem] md:w-[6rem] md:h-[6rem] p-1 border-[2px] border-[#1F1F1F] rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-[#121212] rounded-full p-5">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="object-cover rounded-full scale-[4] md:scale-[1.7] md:w-10 md:h-10"
                        />
                    ) : (
                        <PlusIcon className="scale-[2.5] md:scale-105" />
                    )}
                </div>
            </div>
            <p className="absolute left-1/2 -translate-x-1/2 mt-2 text-[14px]">{title}</p>
        </div>
    );
}
