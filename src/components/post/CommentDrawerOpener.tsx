import { usePost } from "../../context/PostContext"
import { useUser } from "../../context/UserContext"
import { CommentHome } from "../comments/CommentHome"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { CommentDrawer } from "../comments/CommentDrawer"
import { Post } from "../../types/postType"
import React from "react"

interface CommentDrawerOpenerProps {
    item: any;
    setCurrentPost: (value: number) => void;
    index: number;
    isText?: boolean;
}

export const CommentDrawerOpener: React.FC<CommentDrawerOpenerProps> = ({ item, setCurrentPost, index, isText }) => {
    const { innerWidth } = useUser()
    const { setSelectedPost } = usePost()

    return <>
        {innerWidth < 770 &&
            <Drawer>
                <DrawerContent className="bg-[#000] border-t-[1px] border-[#a8a8a8]">
                    <CommentDrawer />
                </DrawerContent>
                <DrawerTrigger>{!isText ? <span onClick={() => setSelectedPost(item)}><CommentHome item={item} setCurrentPost={setCurrentPost} i={index} /></span> : item.commentsCount > 1 && <button onClick={() => setSelectedPost(item)} className="px-2 text-[#a8a8a8] text-[14px]">View all {item.commentsCount} comments</button>}</DrawerTrigger>
            </Drawer>}
    </>
}   
