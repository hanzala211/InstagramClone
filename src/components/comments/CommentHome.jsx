import { CommentSVG } from "../../assets/Constants"

export function CommentHome({ setIsPostOpen, setCurrentIndex, setCurrentPost, i }) {

    return <button onClick={() => {
        setIsPostOpen(true)
        if (setIsPostOpen !== undefined) {
            setCurrentPost(i)
        }
        setCurrentIndex(0)
    }}>
        <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer mt-1" />
    </button>
}