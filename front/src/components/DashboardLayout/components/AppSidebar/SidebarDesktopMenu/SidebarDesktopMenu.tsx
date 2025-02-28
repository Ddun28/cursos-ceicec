import SidebarButtons from '../SidebarButtons/SidebarButtons'

export default function SidebarDesktopMenu() {
  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
       <div className='h-10 w-full bg-gray-500/80 rounded flex items-center font-bold justify-center text-sm'>
                Cursos CEICE
            </div>
            <SidebarButtons/>
    </div>
  )
}
