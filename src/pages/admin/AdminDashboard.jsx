import { BookOpenCheck, CalendarCheck2, FileClock, ShieldCheck, UserCheck, UserRoundX, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import ApiState from '../../components/common/ApiState'
import { adminApi } from '../../api/adminApi'

const metricCards = [
  ['Total Users', 'Future user management'],
  ['Total Providers', 'Future provider directory'],
  ['Approved Providers', 'Future provider analytics'],
  ['Rejected Providers', 'Future provider analytics'],
  ['Total Bookings', 'Future booking dashboard'],
  ['Completed Bookings', 'Future booking dashboard'],
  ['Cancelled Bookings', 'Future booking dashboard']
]

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState(null)
  const [pendingDocuments, setPendingDocuments] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const [providers, documents] = await Promise.allSettled([
        adminApi.getPendingProviders(),
        adminApi.getDocumentsByStatus('PENDING')
      ])
      if (providers.status === 'fulfilled') setPendingProviders(asArray(providers.value.data).length)
      if (documents.status === 'fulfilled') setPendingDocuments(asArray(documents.value.data).length)
      if (providers.status === 'rejected' && documents.status === 'rejected') setError('Admin dashboard data is unavailable right now.')
    } catch {
      setError('Admin dashboard data is unavailable right now.')
    }
  }

  useEffect(() => { load() }, [])

  return <div>
    <p className="eyebrow">MSP ADMIN</p>
    <h1 className="mt-3 display-title">Admin dashboard</h1>
    <p className="mt-3 max-w-3xl text-msp-secondary">Review platform activity, provider approvals, and document verification queues.</p>
    {error && <div className="mt-6"><ApiState message={error} onRetry={load}/></div>}
    <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Users} label="Pending Provider Approvals" value={pendingProviders ?? '--'} note="Live approval queue"/>
      <Metric icon={FileClock} label="Pending Documents" value={pendingDocuments ?? '--'} note="Live verification queue"/>
      <Metric icon={ShieldCheck} label="Platform Control" value="Active" note="Admin role session"/>
      <Metric icon={BookOpenCheck} label="Category Management" value="Ready" note="Frontend workspace"/>
      {metricCards.map(([label, note]) => <Metric key={label} icon={iconFor(label)} label={label} value="--" note={note}/>)}
    </div>
  </div>
}

function Metric({ icon: Icon, label, value, note }) {
  return <article className="card p-5">
    <div className="flex items-start justify-between gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-msp-softGreen text-msp-accent"><Icon size={22}/></span>
      <span className="text-right text-2xl font-bold text-msp-primary">{value}</span>
    </div>
    <h2 className="mt-4 text-base font-bold text-msp-primary">{label}</h2>
    <p className="mt-1 text-sm text-msp-muted">{note}</p>
  </article>
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}

function iconFor(label) {
  if (label.includes('Booking')) return CalendarCheck2
  if (label.includes('Rejected')) return UserRoundX
  if (label.includes('Approved')) return UserCheck
  return Users
}
