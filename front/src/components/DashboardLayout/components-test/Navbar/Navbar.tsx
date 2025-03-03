import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu, Search } from "lucide-react";

import { ModeToggle } from "./ToogleTheme/Toggletheme"; 
import SidebarRoutes from "../Sidebar/SidebarRoutes/SidebarRoutes";

  

export function Navbar() {
  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
        <div className="block xl:hidden">
            <Sheet>
               <SheetTrigger className="flex items-center">
                    <Menu/>
                </SheetTrigger>
                <SheetContent side="left">
                    <SidebarRoutes />
                </SheetContent> 
            </Sheet>
        </div>
        <div className="relative w-[300px]">
      </div>
        <div className="flex gap-x-2 items-center">
            <ModeToggle/>
        </div>
    </nav>
  )
}
