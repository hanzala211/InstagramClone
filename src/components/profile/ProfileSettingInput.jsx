export function ProfileSettingInput({ item }) {
    return <>
        <div>
            <h3 className="text-[20px] font-bold">{item.heading}</h3>
            <input type="text" placeholder={item.heading} maxLength={item.maxLength} minLength={item.minLength} className="w-full py-3 px-4 bg-transparent border-[2px] border-[#424242] outline-none mt-2 rounded-xl" value={item.value} onChange={item.onChange} />
            <p className="text-[#A8A8A8] text-[15px] mt-2 ml-1">Please keep responses within {item.maxLength} characters.</p>
        </div>
    </>
}