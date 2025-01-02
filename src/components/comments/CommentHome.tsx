import { CommentSVG } from "../../assets/Constants"

interface CommentHomeProps {
    setIsPostOpen?: (value: boolean) => void;
    setCurrentIndex?: (value: number) => void;
    setCurrentPost?: (value: number) => void;
    i: number;
    item?: any
}


export const CommentHome: React.FC<CommentHomeProps> = ({ setIsPostOpen, setCurrentIndex, setCurrentPost, i }) => {
    return <button onClick={() => {
        if (setIsPostOpen !== undefined) {
            setIsPostOpen(true)
        }
        if (setCurrentPost !== undefined) {
            setCurrentPost(i)
        }
        if (setCurrentIndex !== undefined) {
            setCurrentIndex(0)
        }
    }}>
        <CommentSVG className="hover:stroke-gray-600 hover:opacity-80 transition-all duration-150 cursor-pointer mt-1" />
    </button>
}