import { Button } from '@/components/ui/button';
import { ChevronLeft } from "lucide-react"
import SidebarButtons from '../SidebarButtons/SidebarButtons';
import { Separator } from '@/components/ui/separator';

interface ISidebarMobileMenuProps {
    isMobileMenuOpen: boolean;
    onMenuButttonClick: () => void;
}

export default function SidebarMobileMenu({isMobileMenuOpen, onMenuButttonClick}: ISidebarMobileMenuProps) {
  return (
    <div className='flex flex-col gap-4 p-4'>
        {isMobileMenuOpen && (
            <>
            <Button onClick={onMenuButttonClick} variant={"outline"}>
                <ChevronLeft className='h-4 w-4 mr-2' /> Cerrar
            </Button>
            <Separator className='bg-gray-400' />
            <div className='h-10 w-full bg-gray-500/80  rounded flex items-center justify-center text-sm'>
                 CEICE
            </div>
            <SidebarButtons />
          </>
        )}
        {!isMobileMenuOpen && (
            <Button onClick={onMenuButttonClick} variant={"outline"}>
                <ChevronLeft className='h-4 w-4 mr-2' /> Abrir
            </Button>
        )}
    </div>
  )
}
