import { Loader } from "./Loader";

const NoteTooltip = ({ isProfile, noteValue, setNoteValue, note, className, noteLoading }) => {
    return (
        <div className="relative inline-block">
            <div
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[rgb(54,54,54)] text-white text-sm rounded-2xl px-4 py-3 flex items-center space-x-1 shadow-lg  ${isProfile ? "" : "max-w-48 w-48 pt-5"
                    }`}
                style={{ minWidth: isProfile ? "4rem" : "10rem" }}
            >
                {!noteLoading ? (
                    isProfile ? (
                        <span
                            className={`text-[#A8A8A8] text-[12px] ${note && note.length !== 0 ? "text-white text-[14px]" : ""
                                } ${className} text-center`}
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                display: "block",
                                maxWidth: "10rem",
                            }}
                        >
                            {note && note.length !== 0 ? note.content : "Note..."}
                        </span>
                    ) : (
                        <textarea
                            type="text"
                            className={`bg-transparent resize-none scrollbar-hidden outline-none text-[20px] placeholder:text-[#737373] ${noteValue.length > 0 ? "text-center" : ""
                                }`}
                            maxLength={60}
                            placeholder="Share a thought..."
                            value={noteValue}
                            onChange={(e) => setNoteValue(e.target.value)}
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                height: "auto",
                                width: "100%",
                                maxWidth: "10rem",
                            }}
                        ></textarea>
                    )
                ) : (
                    <div className="m-2">
                        <Loader widthHeight={true} height="h-0" />
                    </div>
                )}
                <div
                    className={`w-2 h-2 bg-[#363636] rounded-full absolute -z-10 -bottom-1 left-2 ${isProfile ? "" : "w-5 h-5 -bottom-2"
                        }`}
                ></div>
                <div
                    className={`w-1.5 h-1.5 bg-[#363636] rounded-full absolute -z-10 -bottom-3 left-3 ${isProfile ? "" : "w-[0.5vw] h-[1vh] left-[1.5rem] -bottom-4"
                        }`}
                ></div>
            </div>
        </div>
    );
};

export default NoteTooltip;
