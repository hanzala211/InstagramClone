export function Loader({ widthHeight, height }) {
    return <div className={`flex items-center justify-center ${height ? height : "h-[42vh]"}`}>
        <div className={`w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin ${widthHeight ? "w-5 h-5" : "w-10 h-10"}`}></div>
    </div>
}