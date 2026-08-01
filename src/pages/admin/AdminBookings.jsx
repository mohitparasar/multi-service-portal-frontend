import { RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'

const statuses = ['ALL', 'PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED']

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminApi.getBookings()
      setBookings(asArray(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const visibleBookings = useMemo(() => status === 'ALL' ? bookings : bookings.filter((booking) => booking.status === status), [bookings, status])

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">ADMIN OPERATIONS</p>
        <h1 className="mt-3 display-title">Bookings</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">View all bookings across customers and providers.</p>
      </div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {statuses.map((item) => <button key={item} onClick={() => setStatus(item)} className={`rounded-lg px-4 py-2 font-bold ${status === item ? 'bg-msp-primary text-white' : 'border border-msp-border bg-white text-msp-primary'}`}>{item}</button>)}
    </div>

    <div className="mt-8">
      {loading ? <div className="card p-6 text-msp-secondary">Loading bookings...</div> : error ? <ApiState message={error} onRetry={load}/> : visibleBookings.length === 0 ? <EmptyState title="No bookings found" message={`${status} booking list is empty.`}/> : <div className="overflow-hidden rounded-2xl border border-msp-border bg-white shadow-msp">
        <div className="grid min-w-[980px] grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr] border-b border-msp-border bg-msp-softGreen px-5 py-3 text-sm font-bold text-msp-primary">
          <span>Booking</span><span>Customer</span><span>Provider</span><span>Schedule</span><span>Location</span><span>Status</span><span>Payment</span>
        </div>
        <div className="overflow-x-auto">
          {visibleBookings.map((booking) => <div key={booking.id} className="grid min-w-[980px] grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr] gap-3 border-b border-msp-border px-5 py-4 text-sm last:border-b-0">
            <div>
              <p className="font-bold text-msp-primary">{booking.bookingNumber ?? `#${booking.id}`}</p>
              <p className="mt-1 text-msp-muted">{booking.description ?? 'No description'}</p>
            </div>
            <span>{booking.customerId ?? '-'}</span>
            <span>{booking.providerId ?? '-'}</span>
            <span>{[booking.scheduledDate, booking.scheduledTime].filter(Boolean).join(' ') || '-'}</span>
            <span>{[booking.city, booking.state, booking.pincode].filter(Boolean).join(', ') || booking.serviceAddress || '-'}</span>
            <span className="font-bold text-msp-secondary">{booking.status ?? '-'}</span>
            <span>{booking.paymentStatus ?? '-'}</span>
          </div>)}
        </div>
      </div>}
    </div>
  </div>
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}
