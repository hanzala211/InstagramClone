import { usePost } from "../../context/PostContext"
import { useUser } from "../../context/UserContext"
import { CommentHome } from "../comments/CommentHome"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { CommentDrawer } from "../comments/CommentDrawer"

export function CommentDrawerOpener({ item, setCurrentPost, index, setCurrentPostIndex, isText }) {
    const { innerWidth } = useUser()
    const { setSelectedPost, setComments } = usePost()

    return <>
        {innerWidth < 770 &&
            <Drawer onClose={() => {
                setComments([])
                setSelectedPost(null)
            }}>
                <DrawerContent className="bg-[#000] border-t-[1px] border-[#a8a8a8]">
                    <CommentDrawer />
                </DrawerContent>
                <DrawerTrigger>{!isText ? <span onClick={() => setSelectedPost(item)}><CommentHome setCurrentIndex={setCurrentPostIndex} item={item} setCurrentPost={setCurrentPost} i={index} /></span> : item.commentsCount > 1 && <button onClick={() => setSelectedPost(item)} className="px-2 text-[#a8a8a8] text-[14px]">View all {item.commentsCount} comments</button>}</DrawerTrigger>
            </Drawer>}
    </>
}   