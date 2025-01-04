import { Note } from "../../types/note";
import { Loader } from "../helpers/Loader";

interface NoteTooltipProps {
    isProfile?: boolean;
    noteValue?: string;
    setNoteValue?: (value: string) => void;
    note?: Note | [];
    className?: string;
    noteLoading?: boolean;
    isEditor?: boolean;
}

const NoteTooltip: React.FC<NoteTooltipProps> = ({ isProfile, noteValue, setNoteValue, note, className, noteLoading, isEditor }) => {

    return (
        <div className={`relative ${isProfile ? "" : "md:w-48 w-36"}`}>
            <div
                className={`absolute -top-6 md:-top-8 left-[45%] transform -translate-x-1/2 bg-[rgb(54,54,54)] text-white text-sm md:rounded-2xl rounded-xl md:p-3 p-2 space-x-1 ${note?.length === 0 ? "" : "w-[5rem] md:w-auto"} shadow-lg ${isProfile ? "" : "w-full pt-3 md:pt-5"}`}>
                {!noteLoading ? (
                    isProfile ? (
                        <span
                            className={`text-[#A8A8A8] ${note?.content?.length > 12 && !isEditor ? "text-[10px] line-clamp-3" : "text-[12px] md:text-[15px]"} ${note && note.length !== 0 ? "text-white md:px-2" : ""} ${className}`}
                            style={{
                                lineHeight: "1.3"
                            }}
                        >
                            {note && note.length !== 0 ? note.content : "Note..."}
                        </span>
                    ) : (
                        <textarea
                            type="text"
                            className={`bg-transparent resize-none scrollbar-hidden text-[13px] outline-none xl:text-[19px] placeholder:text-[#737373] ${noteValue.length > 0 ? "text-center" : ""
                                }`}
                            maxLength={60}
                            placeholder="Share a thought..."
                            value={noteValue}
                            onChange={(e) => {
                                if (setNoteValue !== undefined) {
                                    setNoteValue(e.target.value)
                                }
                            }}
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                height: "auto",
                                lineHeight: "1.5",
                            }}
                        ></textarea>
                    )
                ) : (
                    <div className="m-2">
                        <Loader widthHeight={true} height="h-0" />
                    </div>
                )}
                <div
                    className={`w-2 h-2 bg-[#363636] rounded-full absolute -z-10 -bottom-1 left-2 ${isProfile ? "" : "w-4 h-4 -bottom-1"
                        }`}
                ></div>
                <div
                    className={`w-1.5 h-1.5 bg-[#363636] rounded-full absolute -z-10 -bottom-3 left-3 ${isProfile ? "" : "w-[2vw] md:w-[0.5vw] h-[1vh] left-[1rem] -bottom-3.5"
                        }`}
                ></div>
            </div>
        </div >
    );
};

export default NoteTooltip;