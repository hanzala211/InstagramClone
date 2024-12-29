import { Outlet, useLocation } from "react-router-dom";
import { ChatUsersSidebar } from "../components/chats/ChatUsersSidebar";
import { PageHeader } from "../components/sidebar/PageHeader";
import { SearchChat } from "../components/chats/SearchChat";


export function Chat() {
    const location = useLocation()

    return <div className="flex flex-row">
        <PageHeader isArrowNeeded={true} isChat={true} isChatting={location.pathname.slice(16, -1) !== ""} />
        <ChatUsersSidebar />
        <Outlet />
        <SearchChat header="New message" isChat={true} />
    </div>
}