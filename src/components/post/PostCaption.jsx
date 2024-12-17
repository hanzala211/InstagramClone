export function PostCaption({ postData, isImg, selectedPost }) {

    return <>
        {selectedPost !== null && selectedPost?.caption && (
            <div>
                <div className={`w-full ${!isImg ? "px-2" : "px-6"} text-[14px]`}>
                    <div className="flex flex-row gap-4 items-start">
                        {isImg && <img src={postData?.profilePic} alt="Profile Picture" className="w-9 rounded-full" />}
                        <p className="text-[#a8a8a1]">
                            <span className="font-semibold mr-3 cursor-default">{postData?.userName}</span>
                            {selectedPost.caption}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </>
}