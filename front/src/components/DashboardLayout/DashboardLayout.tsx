import { ReactNode } from 'react'
import { Separator } from '../ui/separator'
import AppHeader from './components/AppHeader/AppHeader';
import AppSidebar from './components/AppSidebar/AppSidebar';

export interface IAppLayoutProps{
    children: ReactNode;
}

export default function DashboardLayout({children} : IAppLayoutProps) {
  return (
    <div className='w-full h-screen flex flex-row'>
      <AppSidebar/>
      <Separator className='bg-gray-400' orientation='vertical'/>
      <div className='w-full h-full flex flex-col'>
        <header className='h-16 w-full'>
            <AppHeader/>
        </header>
        <Separator className='bg-gray-400'/>
        <main className='w-full h-full p-4'>
            {children}
        </main>
        </div> 
    </div>
  )
}
