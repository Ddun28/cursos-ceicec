import useIsMobileScreenSize from "@/hooks/uselsMobileScreenSize"
import { cn } from "@/lib/utils";
import { useState } from "react";
import SidebarMobileMenu from "./SidebarMobileMenu/SidebarMobileMenu";
import SidebarDesktopMenu from "./SidebarDesktopMenu/SidebarDesktopMenu";

export default function AppSidebar() {

    const isScreenMobileWidth = useIsMobileScreenSize(640);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

  return (
    <nav className={cn("h-full transition", {
        "w-fit" : isScreenMobileWidth, 
        "absolute h-screen w-screen backdrop-blur" : isScreenMobileWidth && isMobileMenuOpen,
        "W-64" : !isScreenMobileWidth
    })}>
        <div className={cn("h-full bg-background", {
            "border-r w-3/6 min-w-64" : isScreenMobileWidth && isMobileMenuOpen
        })}>
            {isScreenMobileWidth && <SidebarMobileMenu
            onMenuButttonClick={handleClick} isMobileMenuOpen={isMobileMenuOpen}
            />}
            {!isScreenMobileWidth && <SidebarDesktopMenu/>}
        </div>

    </nav>
  )
}
