import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'

const statuses = ['PENDING', 'APPROVED', 'REJECTED']

export default function AdminProviders() {
  const [status, setStatus] = useState('APPROVED')
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminApi.getProvidersByStatus(status)
      setProviders(asArray(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load providers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">ADMIN DIRECTORY</p>
        <h1 className="mt-3 display-title">Providers</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">View providers by approval status.</p>
      </div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {statuses.map((item) => <button key={item} onClick={() => setStatus(item)} className={`rounded-lg px-4 py-2 font-bold ${status === item ? 'bg-msp-primary text-white' : 'border border-msp-border bg-white text-msp-primary'}`}>{item}</button>)}
    </div>

    <div className="mt-8">
      {loading ? <div className="card p-6 text-msp-secondary">Loading providers...</div> : error ? <ApiState message={error} onRetry={load}/> : providers.length === 0 ? <EmptyState title="No providers found" message={`${status} provider list is empty.`}/> : <div className="grid gap-4">
        {providers.map((provider) => <article key={provider.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-msp-primary">{provider.fullName ?? 'Provider'}</h2>
              <p className="mt-2 text-sm text-msp-muted">{provider.phone ?? 'No phone provided'}</p>
              <p className="mt-3 max-w-3xl text-msp-secondary">{provider.description ?? 'No description provided.'}</p>
            </div>
            <span className="rounded-lg bg-msp-softWarm px-3 py-1 text-sm font-bold text-msp-secondary">{provider.approvalStatus ?? status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Badge label={`Provider #${provider.id}`}/>
            <Badge label={`Auth user #${provider.authUserId ?? 'N/A'}`}/>
            <Badge label={`${provider.experienceYears ?? 0} years experience`}/>
            <Badge label={`${provider.averageRating ?? 0} rating`}/>
            <Badge label={`${provider.totalJobsCompleted ?? 0} jobs completed`}/>
          </div>
        </article>)}
      </div>}
    </div>
  </div>
}

function Badge({ label }) {
  return <span className="rounded-lg bg-msp-softGreen px-3 py-1 font-semibold text-msp-secondary">{label}</span>
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}
