import { RefreshCw, Search, ShieldCheck, UserRound, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'
import useAuth from '../../hooks/useAuth'

export default function AdminUsers() {
  const auth = useAuth()
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const results = await Promise.allSettled([
      adminApi.getProvidersByStatus('PENDING'),
      adminApi.getProvidersByStatus('APPROVED'),
      adminApi.getProvidersByStatus('REJECTED'),
      adminApi.getBookings()
    ])
    const [pendingProviders, approvedProviders, rejectedProviders, bookings] = results.map((result) => result.status === 'fulfilled' ? asArray(result.value.data) : [])
    setUsers(buildUsers({ auth, providers: [...pendingProviders, ...approvedProviders, ...rejectedProviders], bookings }))
    if (results.every((result) => result.status === 'rejected')) setError('Unable to load available user data.')
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredUsers = useMemo(() => {
    const text = query.trim().toLowerCase()
    return users.filter((user) => {
      const matchesRole = role === 'ALL' || user.role === role
      const matchesQuery = !text || [user.id, user.email, user.role, user.source].some((value) => String(value ?? '').toLowerCase().includes(text))
      return matchesRole && matchesQuery
    })
  }, [users, query, role])

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">ADMIN DIRECTORY</p>
        <h1 className="mt-3 display-title">Users</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">Users visible from provider and booking records.</p>
      </div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>

    <div className="mt-8 grid gap-5 md:grid-cols-4">
      <Metric icon={Users} label="Visible Users" value={users.length}/>
      <Metric icon={ShieldCheck} label="Customers" value={users.filter((user) => user.role === 'CUSTOMER').length}/>
      <Metric icon={UserRound} label="Providers" value={users.filter((user) => user.role === 'PROVIDER').length}/>
      <Metric icon={ShieldCheck} label="Admins" value={users.filter((user) => user.role === 'ADMIN').length}/>
    </div>

    <div className="card mt-8 grid gap-3 p-5 md:grid-cols-[1fr_auto]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-msp-muted" size={18}/>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="field pl-11" placeholder="Search by id, email, role or source"/>
      </label>
      <select value={role} onChange={(event) => setRole(event.target.value)} className="field md:w-48">
        <option value="ALL">All roles</option>
        <option value="ADMIN">Admin</option>
        <option value="CUSTOMER">Customer</option>
        <option value="PROVIDER">Provider</option>
      </select>
    </div>

    <div className="mt-8">
      {loading ? <div className="card p-6 text-msp-secondary">Loading users...</div> : error ? <ApiState message={error} onRetry={load}/> : filteredUsers.length === 0 ? <EmptyState title="No users found" message="No matching users are visible from available admin records."/> : <div className="overflow-hidden rounded-2xl border border-msp-border bg-white shadow-msp">
        <div className="grid min-w-[920px] grid-cols-[0.8fr_1fr_1.4fr_1fr_1.2fr] border-b border-msp-border bg-msp-softGreen px-5 py-3 text-sm font-bold text-msp-primary">
          <span>User ID</span>
          <span>Role</span>
          <span>Email</span>
          <span>Status</span>
          <span>Source</span>
        </div>
        <div className="overflow-x-auto">
          {filteredUsers.map((user) => <div key={`${user.role}-${user.id}`} className="grid min-w-[920px] grid-cols-[0.8fr_1fr_1.4fr_1fr_1.2fr] gap-3 border-b border-msp-border px-5 py-4 text-sm last:border-b-0">
            <span className="font-bold text-msp-primary">{user.id}</span>
            <span className="font-bold text-msp-secondary">{user.role}</span>
            <span>{user.email ?? '-'}</span>
            <span>{user.status}</span>
            <span>{user.source}</span>
          </div>)}
        </div>
      </div>}
    </div>
  </div>
}

function buildUsers({ auth, providers, bookings }) {
  const map = new Map()
  const add = (user) => {
    if (!user.id) return
    const key = `${user.role}-${user.id}`
    const existing = map.get(key)
    map.set(key, existing ? { ...existing, source: mergeSource(existing.source, user.source) } : user)
  }

  add({ id: auth.userId, email: auth.email, role: auth.role ?? 'ADMIN', status: auth.isAuthenticated ? 'ACTIVE' : 'UNKNOWN', source: 'Current session' })
  providers.forEach((provider) => add({ id: provider.authUserId, role: 'PROVIDER', status: provider.approvalStatus ?? 'UNKNOWN', source: `Provider #${provider.id}` }))
  bookings.forEach((booking) => {
    add({ id: booking.customerId, role: 'CUSTOMER', status: booking.status ?? 'UNKNOWN', source: `Booking ${booking.bookingNumber ?? booking.id}` })
    add({ id: booking.providerId, role: 'PROVIDER', status: booking.status ?? 'UNKNOWN', source: `Booking ${booking.bookingNumber ?? booking.id}` })
  })

  return Array.from(map.values()).sort((a, b) => String(a.role).localeCompare(String(b.role)) || Number(a.id) - Number(b.id))
}

function mergeSource(first, second) {
  if (!first) return second
  if (!second || first.includes(second)) return first
  return `${first}, ${second}`
}

function Metric({ icon: Icon, label, value }) {
  return <article className="card p-5">
    <div className="flex items-center justify-between gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-msp-softGreen text-msp-accent"><Icon size={22}/></span>
      <span className="text-right text-2xl font-bold text-msp-primary">{value}</span>
    </div>
    <h2 className="mt-4 text-base font-bold text-msp-primary">{label}</h2>
  </article>
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}
