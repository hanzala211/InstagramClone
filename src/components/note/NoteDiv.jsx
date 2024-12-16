import NoteTooltip from "./Note";

export function NoteDiv({ notes, isChat }) {
    return <div className={`absolute z-[1] ${isChat ? "-top-3 left-14" : "top-3 left-[3rem] sm:top-5 sm:left-[3.5rem] md:left-[3.5rem] lg:left-[4.5rem] md:top-3"}`}>
        <NoteTooltip isProfile={true} note={notes} />
    </div>
}