import { SaveSVG, UnSave } from "../assets/Constants";

export function SavedComponent({ isSaved, savePost, unSavePost }) {
    return <>
        {!isSaved ?
            <button onClick={savePost}>
                <SaveSVG className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" />
            </button>
            :
            <button onClick={unSavePost}><UnSave className="hover:stroke-gray-300 hover:opacity-80 transition-all duration-150 cursor-pointer stroke-[rgb(245,245,245)]" /></button>
        }</>
}