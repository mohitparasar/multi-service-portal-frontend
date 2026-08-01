import { Check, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'

export default function PendingProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminApi.getPendingProviders()
      setProviders(asArray(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load pending providers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const decide = async (provider, action) => {
    if (!provider.id) return toast.error('Provider id is missing')
    setBusyId(`${action}-${provider.id}`)
    try {
      if (action === 'approve') await adminApi.approveProvider(provider.id)
      else await adminApi.rejectProvider(provider.id)
      toast.success(action === 'approve' ? 'Provider approved' : 'Provider rejected')
      setProviders((items) => items.filter((item) => item.id !== provider.id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setBusyId('')
    }
  }

  if (loading) return <QueueShell><div className="card p-6 text-msp-secondary">Loading pending providers...</div></QueueShell>
  if (error) return <QueueShell><ApiState message={error} onRetry={load}/></QueueShell>

  return <QueueShell onRefresh={load}>
    {providers.length === 0 ? <EmptyState title="No pending providers" message="Provider approval queue is clear."/> : <div className="grid gap-4">
      {providers.map((provider) => <article key={provider.id} className="card p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-xl font-bold text-msp-primary">{provider.fullName ?? 'Provider'}</h2>
            <p className="mt-2 text-sm text-msp-muted">{provider.phone ?? 'No phone provided'}</p>
            <p className="mt-3 max-w-3xl text-msp-secondary">{provider.description ?? 'No description provided.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Badge label={`Auth user #${provider.authUserId ?? 'N/A'}`}/>
              <Badge label={`${provider.experienceYears ?? 0} years experience`}/>
              <Badge label={`${provider.averageRating ?? 0} rating`}/>
              <Badge label={`${provider.totalJobsCompleted ?? 0} jobs completed`}/>
              <Badge label={provider.approvalStatus ?? 'PENDING'}/>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <button onClick={() => decide(provider, 'approve')} disabled={busyId === `approve-${provider.id}`} className="btn-primary px-4 py-2"><Check size={17} className="mr-2"/>Approve</button>
            <button onClick={() => decide(provider, 'reject')} disabled={busyId === `reject-${provider.id}`} className="btn-secondary px-4 py-2"><X size={17} className="mr-2"/>Reject</button>
          </div>
        </div>
      </article>)}
    </div>}
  </QueueShell>
}

function QueueShell({ children, onRefresh }) {
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="eyebrow">ADMIN REVIEW</p><h1 className="mt-3 display-title">Provider approvals</h1></div>
      {onRefresh && <button onClick={onRefresh} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>}
    </div>
    <div className="mt-8">{children}</div>
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
