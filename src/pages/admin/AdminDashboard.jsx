import { CalendarCheck2, FileClock, ShieldCheck, UserCheck, UserRoundX, Users, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'

const initialMetrics = {
  pendingProviders: null,
  approvedProviders: null,
  rejectedProviders: null,
  pendingDocuments: null,
  approvedDocuments: null,
  rejectedDocuments: null,
  categories: null,
  bookings: null,
  completedBookings: null,
  cancelledBookings: null
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    const requests = await Promise.allSettled([
      adminApi.getProvidersByStatus('PENDING'),
      adminApi.getProvidersByStatus('APPROVED'),
      adminApi.getProvidersByStatus('REJECTED'),
      adminApi.getDocumentsByStatus('PENDING'),
      adminApi.getDocumentsByStatus('VERIFIED'),
      adminApi.getDocumentsByStatus('REJECTED'),
      adminApi.getCategories(),
      adminApi.getBookings()
    ])

    const [
      pendingProviders,
      approvedProviders,
      rejectedProviders,
      pendingDocuments,
      approvedDocuments,
      rejectedDocuments,
      categories,
      bookings
    ] = requests.map((result) => result.status === 'fulfilled' ? asArray(result.value.data) : null)

    setMetrics({
      pendingProviders: count(pendingProviders),
      approvedProviders: count(approvedProviders),
      rejectedProviders: count(rejectedProviders),
      pendingDocuments: count(pendingDocuments),
      approvedDocuments: count(approvedDocuments),
      rejectedDocuments: count(rejectedDocuments),
      categories: count(categories),
      bookings: count(bookings),
      completedBookings: bookings ? bookings.filter((booking) => booking.status === 'COMPLETED').length : null,
      cancelledBookings: bookings ? bookings.filter((booking) => booking.status === 'CANCELLED').length : null
    })

    if (requests.every((result) => result.status === 'rejected')) {
      setError('Admin dashboard data is unavailable. Confirm backend services and gateway are running.')
    }
  }

  useEffect(() => { load() }, [])

  return <div>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="eyebrow">MSP ADMIN</p>
        <h1 className="mt-3 display-title">Admin dashboard</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">Live operational view for provider approvals, documents, categories, and bookings.</p>
      </div>
      <button onClick={load} className="btn-secondary">Refresh</button>
    </div>

    {error && <div className="mt-6"><ApiState message={error} onRetry={load}/></div>}

    <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={Users} label="Pending Providers" value={metrics.pendingProviders} note="Waiting for admin approval"/>
      <Metric icon={UserCheck} label="Approved Providers" value={metrics.approvedProviders} note="Ready to receive bookings"/>
      <Metric icon={UserRoundX} label="Rejected Providers" value={metrics.rejectedProviders} note="Rejected onboarding"/>
      <Metric icon={FileClock} label="Pending Documents" value={metrics.pendingDocuments} note="Waiting for verification"/>
      <Metric icon={ShieldCheck} label="Verified Documents" value={metrics.approvedDocuments} note="Verified documents"/>
      <Metric icon={UserRoundX} label="Rejected Documents" value={metrics.rejectedDocuments} note="Rejected documents"/>
      <Metric icon={Wrench} label="Categories" value={metrics.categories} note="Service categories"/>
      <Metric icon={CalendarCheck2} label="Total Bookings" value={metrics.bookings} note="All customer bookings"/>
      <Metric icon={CalendarCheck2} label="Completed Bookings" value={metrics.completedBookings} note="Finished jobs"/>
      <Metric icon={CalendarCheck2} label="Cancelled Bookings" value={metrics.cancelledBookings} note="Cancelled jobs"/>
    </div>
  </div>
}

function Metric({ icon: Icon, label, value, note }) {
  return <article className="card p-5">
    <div className="flex items-start justify-between gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-msp-softGreen text-msp-accent"><Icon size={22}/></span>
      <span className="text-right text-2xl font-bold text-msp-primary">{value ?? '--'}</span>
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

function count(items) {
  return Array.isArray(items) ? items.length : null
}
