import { Home, Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'

export default function DashboardLayout({ title, links }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="flex min-h-screen bg-msp-background">
    <div className="hidden lg:block"><DashboardSidebar title={title} links={links}/></div>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={()=>setMobileOpen(false)}/><div className="relative h-full w-72"><DashboardSidebar title={title} links={links} onNavigate={()=>setMobileOpen(false)}/></div></div>}
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-msp-border bg-white/90 px-5 backdrop-blur lg:hidden">
        <button onClick={()=>setMobileOpen(true)} className="rounded-lg border border-msp-border p-2 text-msp-primary"><Menu/></button>
        <Link to="/" className="flex items-center gap-2 font-bold text-msp-primary"><Home size={18}/> Home</Link>
      </header>
      <main className="p-5 md:p-10"><Outlet/></main>
    </div>
  </div>
}
