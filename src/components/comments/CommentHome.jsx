import { CommentSVG } from "../../assets/Constants"

export function CommentHome({ setIsPostOpen, setCurrentIndex, setCurrentPost, setSelectedPost, item, i }) {
    return <button onClick={() => {
        setIsPostOpen(true)
        setCurrentPost(i)
        setCurrentIndex(0)
        setSelectedPost(item)
    }}>
        <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer" />
    </button>
}