import { BadgeCheck, Save, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { providerApi } from '../../api/providerApi'
import ApiState from '../../components/common/ApiState'
import { getApiErrorMessage } from '../../utils/apiError'

const emptyProfile = { fullName: '', phone: '', profileImage: '', description: '', experienceYears: 0 }

export default function ProviderProfile() {
  const [form, setForm] = useState(emptyProfile)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    providerApi.getMyProfile()
      .then(({ data }) => {
        const value = data?.data || data
        setProfile(value)
        setForm({ ...emptyProfile, ...value })
      })
      .catch((err) => {
        if (err.response?.status !== 404) setError(getApiErrorMessage(err, 'Unable to load your provider profile.'))
      })
      .finally(() => setLoading(false))
  }, [])

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, experienceYears: Number(form.experienceYears) }
      const { data } = profile ? await providerApi.updateProfile(payload) : await providerApi.createProfile(payload)
      const value = data?.data || data
      setProfile(value)
      setForm({ ...emptyProfile, ...value })
      toast.success(profile ? 'Profile updated' : 'Provider profile created')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your provider profile.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-msp-secondary">Loading provider profile...</p>

  return <div className="mx-auto max-w-5xl">
    <p className="eyebrow">PROFESSIONAL PROFILE</p>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
      <h1 className="display-title">{profile ? 'Update your profile' : 'Create your provider profile'}</h1>
      {profile?.approvalStatus && <span className="inline-flex items-center gap-2 rounded-full bg-msp-softGreen px-4 py-2 text-sm font-bold text-msp-primary"><BadgeCheck size={17}/>{profile.approvalStatus}</span>}
    </div>
    <p className="mt-3 text-msp-secondary">Customers see these details when they search for a professional.</p>
    {error && <div className="mt-6"><ApiState message={error}/></div>}
    <form onSubmit={submit} className="card mt-7 grid gap-5 p-6 md:grid-cols-2">
      <div className="md:col-span-2 flex items-center gap-4 rounded-xl bg-msp-softGreen p-4">
        {form.profileImage ? <img src={form.profileImage} alt="" className="h-16 w-16 rounded-full object-cover"/> : <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-msp-primary"><UserRound size={28}/></span>}
        <div><p className="font-bold text-msp-primary">{form.fullName || 'Your public profile'}</p><p className="text-sm text-msp-secondary">{profile?.averageRating ?? 0} rating · {profile?.totalJobsCompleted ?? 0} jobs completed</p></div>
      </div>
      <label className="text-sm font-semibold text-msp-primary">Full name<input required name="fullName" value={form.fullName} onChange={update} className="field mt-2"/></label>
      <label className="text-sm font-semibold text-msp-primary">Phone<input required name="phone" type="tel" value={form.phone} onChange={update} className="field mt-2"/></label>
      <label className="text-sm font-semibold text-msp-primary">Experience (years)<input required name="experienceYears" type="number" min="0" max="60" value={form.experienceYears} onChange={update} className="field mt-2"/></label>
      <label className="text-sm font-semibold text-msp-primary">Profile image URL<input name="profileImage" type="url" value={form.profileImage || ''} onChange={update} className="field mt-2" placeholder="https://..."/></label>
      <label className="text-sm font-semibold text-msp-primary md:col-span-2">Professional description<textarea required name="description" maxLength="1000" value={form.description || ''} onChange={update} className="field mt-2 min-h-32" placeholder="Describe your experience and the quality of your work."/></label>
      <button disabled={saving} className="btn-primary md:col-span-2 disabled:opacity-60"><Save size={18} className="mr-2"/>{saving ? 'Saving...' : profile ? 'Save profile changes' : 'Create profile'}</button>
    </form>
  </div>
}
