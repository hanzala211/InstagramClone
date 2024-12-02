import { CreatePosts } from "../assets/Constants";

export function SelectImage({ handleFile, fileInputRef, handleFileChange }) {
    return <div className="bg-[#262626] flex items-center justify-center flex-col gap-2 w-full sm:w-[60vw] xl:w-[40vw] h-[72vh] px-5 py-5">
        <CreatePosts />
        <p className="text-[20px]">Drag photos and videos here</p>
        <button
            onClick={handleFile}
            className="bg-[#0095F6] hover:bg-opacity-70 transition-all duration-200 px-3 py-2 text-[14px] rounded-lg"
        >
            Select From Computer
        </button>
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            multiple={true}
        />
    </div>
}