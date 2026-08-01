import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'

export default function AdminReports() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    const results = await Promise.allSettled([
      adminApi.getProvidersByStatus('APPROVED'),
      adminApi.getCategories(),
      adminApi.getBookings()
    ])
    const [providers, categories, bookings] = results.map((result) => result.status === 'fulfilled' ? asArray(result.value.data) : [])
    setReport({
      providers: providers.length,
      categories: categories.length,
      bookings: bookings.length,
      completed: bookings.filter((booking) => booking.status === 'COMPLETED').length,
      cancelled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
      estimatedRevenue: bookings.reduce((total, booking) => total + Number(booking.finalPrice ?? booking.estimatedPrice ?? 0), 0)
    })
    if (results.every((result) => result.status === 'rejected')) setError('Reports data is unavailable.')
  }

  useEffect(() => { load() }, [])

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">ADMIN ANALYTICS</p>
        <h1 className="mt-3 display-title">Reports</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">Current summary from available provider, category, and booking APIs.</p>
      </div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>

    {error && <div className="mt-8"><ApiState message={error} onRetry={load}/></div>}

    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <Metric label="Approved providers" value={report?.providers}/>
      <Metric label="Service categories" value={report?.categories}/>
      <Metric label="Total bookings" value={report?.bookings}/>
      <Metric label="Completed jobs" value={report?.completed}/>
      <Metric label="Cancelled jobs" value={report?.cancelled}/>
      <Metric label="Estimated revenue" value={report ? `₹${report.estimatedRevenue.toFixed(2)}` : null}/>
    </div>
  </div>
}

function Metric({ label, value }) {
  return <article className="card p-5">
    <p className="text-sm font-bold uppercase tracking-widest text-msp-accent">{label}</p>
    <p className="mt-4 text-3xl font-bold text-msp-primary">{value ?? '--'}</p>
  </article>
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}
