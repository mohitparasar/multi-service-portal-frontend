import { Check, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'

export default function DocumentVerification() {
  const [documents, setDocuments] = useState([])
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminApi.getDocumentsByStatus(status)
      setDocuments(asArray(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load provider documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  const decide = async (document, action) => {
    const id = document.documentId ?? document.id
    if (!id) return toast.error('Document id is missing')
    setBusyId(`${action}-${id}`)
    try {
      if (action === 'approve') await adminApi.approveDocument(id)
      else await adminApi.rejectDocument(id)
      toast.success(action === 'approve' ? 'Document approved' : 'Document rejected')
      if (status === 'PENDING') setDocuments((items) => items.filter((item) => (item.documentId ?? item.id) !== id))
      else load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setBusyId('')
    }
  }

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="eyebrow">ADMIN REVIEW</p><h1 className="mt-3 display-title">Document verification</h1></div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>
    <div className="mt-6 flex flex-wrap gap-2">
      {['PENDING', 'APPROVED', 'REJECTED'].map((item) => <button key={item} onClick={() => setStatus(item)} className={`rounded-lg px-4 py-2 font-bold ${status === item ? 'bg-msp-primary text-white' : 'border border-msp-border bg-white text-msp-primary'}`}>{item}</button>)}
    </div>
    <div className="mt-8">
      {loading ? <div className="card p-6 text-msp-secondary">Loading documents...</div> : error ? <ApiState message={error} onRetry={load}/> : documents.length === 0 ? <EmptyState title="No documents found" message={`${status} document queue is clear.`}/> : <div className="grid gap-4">
        {documents.map((document) => {
          const id = document.documentId ?? document.id
          const imageUrl = document.imageUrl ?? document.documentUrl ?? document.fileUrl ?? document.url
          return <article key={id ?? document.providerName} className="card overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
              <div className="bg-msp-softGreen">
                {imageUrl ? <a href={imageUrl} target="_blank" rel="noreferrer"><img src={imageUrl} alt={document.documentType ?? 'Provider document'} className="h-56 w-full object-cover lg:h-full"/></a> : <div className="grid h-56 place-items-center text-sm font-bold text-msp-muted">No image</div>}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-msp-primary">{document.providerName ?? document.name ?? 'Provider document'}</h2>
                    <p className="mt-2 font-semibold text-msp-secondary">{document.documentType ?? document.type ?? 'Document'}</p>
                    <p className="mt-3 text-sm text-msp-muted">{document.remarks ?? 'No remarks submitted.'}</p>
                  </div>
                  <span className="rounded-lg bg-msp-softWarm px-3 py-1 text-sm font-bold text-msp-secondary">{document.status ?? status}</span>
                </div>
                {status === 'PENDING' && <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => decide(document, 'approve')} disabled={busyId === `approve-${id}`} className="btn-primary px-4 py-2"><Check size={17} className="mr-2"/>Approve</button>
                  <button onClick={() => decide(document, 'reject')} disabled={busyId === `reject-${id}`} className="btn-secondary px-4 py-2"><X size={17} className="mr-2"/>Reject</button>
                </div>}
              </div>
            </div>
          </article>
        })}
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
