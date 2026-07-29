import { ExternalLink, Home, LogOut, UserRound } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function DashboardSidebar({ title, links, onNavigate }) {
  const { email, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/') }
  const navClass = ({isActive}) => `flex items-center gap-3 rounded-lg px-4 py-3 transition ${isActive ? 'bg-white text-msp-primary shadow-sm' : 'text-white/85 hover:bg-white/10 hover:text-white'}`
  return <aside className="flex min-h-screen w-72 flex-col bg-msp-primary p-6 text-white">
    <Link to="/" onClick={onNavigate} className="mb-10 font-display text-3xl font-bold">MSP<span className="text-msp-accent">.</span></Link>
    <p className="mb-2 text-xs uppercase tracking-widest text-white/60">{title}</p>
    <p className="mb-8 truncate text-sm text-white/80">{email}</p>
    <nav className="space-y-2">
      <NavLink onClick={onNavigate} to="dashboard" className={navClass}><Home size={19}/>Dashboard</NavLink>
      {links.map(({to,label,icon:Icon=UserRound}) => <NavLink onClick={onNavigate} key={to} to={to} className={navClass}><Icon size={19}/>{label}</NavLink>)}
    </nav>
    <div className="mt-auto space-y-2 border-t border-white/15 pt-5">
      <Link onClick={onNavigate} to="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/85 hover:bg-white/10"><ExternalLink size={19}/>Return to website</Link>
      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-white/85 hover:bg-white/10"><LogOut size={19}/>Log out</button>
    </div>
  </aside>
}
