import { ReactNode } from "react";

export interface SideBarItemsType{
    activeIcon?: ReactNode;
    homeactive?: boolean;
    icon?: ReactNode;
    isNotification?: boolean;
    text?: string;
    to?: string;
    onClick?: (e: any) => void | null;
    ref?: any;
    isImg?: boolean;
    profileImg?: string;
}