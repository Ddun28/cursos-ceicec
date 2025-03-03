import { ReactNode } from 'react'
import { Navbar } from './components-test/Navbar';
import { Sidebar } from './components-test/Sidebar';

export interface IAppLayoutProps{
    children: ReactNode;
}

export default function DashboardLayout({children} : IAppLayoutProps) {
  return (
    <div className="flex w-full dark:bg-slate-900 dark:text-white h-full">
        <div className="hidden dark:bg-slate-900  xl:block w-80 h-full xl:fixed">
            <Sidebar />
        </div>
        <div className="w-full xl:ml-80">
            <Navbar />
            <div className="p-6 bg-[#fafbfc] dark:bg-slate-900">
                {children}
            </div>
        </div>
    </div>
  )
}
