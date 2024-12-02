import { HoverCard, HoverCardTrigger, HoverCardContent } from "@radix-ui/react-hover-card"
import { UserHoverModal } from "./UserHoverModal"
import { useState } from "react"
export function HoverModal({ item }) {
    const [isHovered, setIsHovered] = useState(false)
    console.log(isHovered)
    return <HoverCard >
        <HoverCardTrigger onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>Hover</HoverCardTrigger>
        <HoverCardContent>
            <UserHoverModal isHovered={isHovered} />
        </HoverCardContent>
    </HoverCard>
}