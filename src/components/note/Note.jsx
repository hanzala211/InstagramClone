import { Loader } from "../helpers/Loader";

const NoteTooltip = ({ isProfile, noteValue, setNoteValue, note, className, noteLoading }) => {
    return (
        <div className={`relative ${isProfile ? "" : "md:w-48 w-36"}`}>
            <div
                className={`absolute -top-6 md:-top-8 left-[45%] transform -translate-x-1/2 bg-[rgb(54,54,54)] text-white text-sm md:rounded-2xl rounded-xl md:px-4 md:py-3 p-2 md:flex md:items-center space-x-1 shadow-lg ${isProfile ? "" : "w-full pt-3 md:pt-5"
                    }`}>
                {!noteLoading ? (
                    isProfile ? (
                        <span
                            className={`text-[#A8A8A8] text-[10px] md:text-[15px] ${note && note.length !== 0 ? "text-white text-[15px] px-2 " : ""
                                } ${className} text-center`}
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "normal",
                                display: "block",
                                maxWidth: "4rem",
                            }}
                        >
                            {note && note.length !== 0 ? note.content : "Note..."}
                        </span>
                    ) : (
                        <textarea
                            type="text"
                            className={`bg-transparent resize-none scrollbar-hidden text-[15px] outline-none xl:text-[19px] placeholder:text-[#737373] ${noteValue.length > 0 ? "text-center" : ""
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
                    className={`w-2 h-2 bg-[#363636] rounded-full absolute -z-10 -bottom-1 left-2 ${isProfile ? "" : "w-4 h-4 -bottom-1"
                        }`}
                ></div>
                <div
                    className={`w-1.5 h-1.5 bg-[#363636] rounded-full absolute -z-10 -bottom-3 left-3 ${isProfile ? "" : "w-[0.5vw] h-[1vh] left-[1rem] -bottom-3.5"
                        }`}
                ></div>
            </div>
        </div >
    );
};

export default NoteTooltip;
