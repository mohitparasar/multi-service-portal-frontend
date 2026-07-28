import { ArrowLeft, CalendarCheck, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import ApiState from '../../components/common/ApiState'
import { getApiErrorMessage } from '../../utils/apiError'

const today = new Date().toISOString().split('T')[0]

export default function CreateBooking() {
  const provider = useLocation().state?.provider
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    providerId: provider?.providerId || provider?.id || '',
    categoryId: provider?.categoryId || '',
    serviceAddress: '', city: '', state: 'Maharashtra', pincode: '',
    scheduledDate: '', scheduledTime: '', estimatedPrice: provider?.basePrice || provider?.price || ''
  })

  const missingProvider = useMemo(() => !form.providerId, [form.providerId])

  const submit = async (event) => {
    event.preventDefault()
    if (missingProvider) { setError('The selected provider information is missing. Return to provider search and choose again.'); return }
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) { setError('Enter a valid six-digit Indian pincode.'); return }
    if (form.scheduledDate < today) { setError('Booking date cannot be in the past.'); return }
    setSaving(true); setError('')
    try {
      await bookingApi.create({ ...form, providerId: Number(form.providerId), categoryId: Number(form.categoryId), estimatedPrice: Number(form.estimatedPrice) })
      toast.success('Booking created successfully')
      navigate('/customer/bookings')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Booking creation is temporarily unavailable. We are working to resolve the issue; your form details are still here.'))
    } finally { setSaving(false) }
  }

  return <div className="mx-auto max-w-5xl">
    <Link to="/providers" className="inline-flex items-center gap-2 font-bold text-msp-accent"><ArrowLeft size={17}/>Back to providers</Link>
    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="eyebrow">NEW BOOKING</p><h1 className="mt-2 display-title">Book your service</h1>
        <p className="mt-2 text-msp-secondary">Your booking will appear in both the customer and provider dashboards after it is created.</p>
        {error && <div className="mt-6"><ApiState message={error}/></div>}
        <form onSubmit={submit} className="card mt-7 grid gap-5 p-6 md:grid-cols-2">
          {[['providerId','Provider ID','number'],['categoryId','Category ID','number'],['city','City','text'],['state','State','text'],['pincode','Pincode','text'],['scheduledDate','Scheduled date','date'],['scheduledTime','Scheduled time','time'],['estimatedPrice','Estimated price','number']].map(([name,label,type]) => <label key={name} className="text-sm font-semibold text-msp-primary">{label}<input required min={name==='scheduledDate'?today:undefined} readOnly={name==='providerId'} type={type} value={form[name]} onChange={(e)=>setForm({...form,[name]:e.target.value})} className={`field mt-2 ${name==='providerId'?'cursor-not-allowed opacity-70':''}`}/></label>)}
          <label className="text-sm font-semibold text-msp-primary md:col-span-2">Service address<textarea required maxLength={500} value={form.serviceAddress} onChange={(e)=>setForm({...form,serviceAddress:e.target.value})} className="field mt-2 min-h-28"/><span className="mt-1 block text-right text-xs text-msp-muted">{form.serviceAddress.length}/500</span></label>
          <button disabled={saving || missingProvider} className="btn-primary md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Creating booking...' : 'Confirm booking'}</button>
        </form>
      </div>
      <aside className="card h-fit p-6 lg:sticky lg:top-8">
        <p className="eyebrow">SELECTED PROVIDER</p>
        <h2 className="mt-3 font-display text-2xl font-bold text-msp-primary">{provider?.fullName || provider?.providerName || 'Provider details unavailable'}</h2>
        <p className="mt-2 text-sm text-msp-secondary">{provider?.city || 'Service area'} · {provider?.experienceYears ?? 0} years experience</p>
        <div className="mt-5 space-y-3 border-t border-msp-border pt-5 text-sm text-msp-secondary"><p className="flex gap-2"><ShieldCheck size={17} className="text-msp-accent"/>Approved provider</p><p className="flex gap-2"><CalendarCheck size={17} className="text-msp-accent"/>Track status in dashboard</p></div>
      </aside>
    </div>
  </div>
}
