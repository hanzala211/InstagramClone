import { Outlet } from "react-router-dom";
import { ChatUsersSidebar } from "../components/chats/ChatUsersSidebar";
import { SearchChat } from "../components/chats/SearchChat";
import { PostPageHeader } from "../components/sidebar/PostPageHeader";


export function Chat() {
    return <div className="flex flex-row">
        <PostPageHeader isArrowNeeded={true} isHomePage={false} isInbox={true} />
        <ChatUsersSidebar />
        <Outlet />
        <SearchChat header="New message" isChat={true} />
    </div>
}