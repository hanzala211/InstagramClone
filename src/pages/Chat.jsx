import { Outlet } from "react-router-dom";
import { ChatUsersSidebar } from "../components/chats/ChatUsersSidebar";
import { NewChat } from "../components/chats/NewChat";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";


export function Chat() {
    return <div className="flex flex-row">
        <PostPageHeader isArrowNeeded={true} isHomePage={false} isInbox={true} />
        <ChatUsersSidebar />
        <Outlet />
        <NewChat />
    </div>
}