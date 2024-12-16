export function InputLabel({ onChange, value, text }) {
    return <div className="relative">
        <label htmlFor={value} className={`text-[#A8A8A8] text-[12px] top-1/2 transition-all duration-100 -translate-y-1/2 left-2.5 absolute pointer-events-none ${value.length > 0 ? "text-[8px] -translate-y-[17px]" : ""}`}>{text}</label>
        <input type="text" className="bg-[#121212] pl-2 h-[2.5rem] outline-none pr-2 w-[17.5rem] border-[1px] text-[11px] border-[#A8A8A8] rounded-md" id={value} value={value} onChange={onChange} />
    </div>
}