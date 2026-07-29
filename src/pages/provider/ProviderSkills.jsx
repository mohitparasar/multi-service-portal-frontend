import { Pencil, Plus, Trash2, Wrench } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { providerApi } from '../../api/providerApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'
import { getApiErrorMessage } from '../../utils/apiError'

export default function ProviderSkills() {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ categoryId: '', basePrice: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [skillResponse, categoryResponse] = await Promise.all([providerApi.getSkills(), providerApi.getCategories()])
      setSkills(Array.isArray(skillResponse.data) ? skillResponse.data : [])
      setCategories((Array.isArray(categoryResponse.data) ? categoryResponse.data : []).filter((item) => item.active !== false))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load skills and service categories. Create your provider profile first.'))
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const availableCategories = useMemo(() => categories.filter((category) => editing || !skills.some((skill) => String(skill.category?.id || skill.categoryId) === String(category.id))), [categories, editing, skills])

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { categoryId: Number(form.categoryId), basePrice: Number(form.basePrice) }
      if (editing) await providerApi.updateSkill(editing.id, payload)
      else await providerApi.createSkill(payload)
      toast.success(editing ? 'Skill updated' : 'Service skill added')
      setEditing(null); setForm({ categoryId: '', basePrice: '' }); await load()
    } catch (err) { setError(getApiErrorMessage(err, 'Could not save this skill.')) }
    finally { setSaving(false) }
  }

  const edit = (skill) => {
    setEditing(skill)
    setForm({ categoryId: skill.category?.id || skill.categoryId || '', basePrice: skill.basePrice })
  }
  const remove = async (id) => {
    if (!window.confirm('Delete this service skill?')) return
    try { await providerApi.deleteSkill(id); toast.success('Skill deleted'); load() }
    catch (err) { toast.error(getApiErrorMessage(err)) }
  }

  return <div className="mx-auto max-w-6xl">
    <p className="eyebrow">SERVICES & PRICING</p><h1 className="mt-2 display-title">Your professional skills</h1>
    <p className="mt-3 text-msp-secondary">Add the categories you provide and set a starting price for customer searches.</p>
    {error && <div className="mt-6"><ApiState message={error} onRetry={load}/></div>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="card h-fit p-6">
        <h2 className="font-display text-2xl font-bold text-msp-primary">{editing ? 'Edit skill' : 'Add a service'}</h2>
        <label className="mt-5 block text-sm font-semibold text-msp-primary">Service category
          <select required disabled={Boolean(editing)} value={form.categoryId} onChange={(e)=>setForm({...form,categoryId:e.target.value})} className="field mt-2">
            <option value="">Select a category</option>{availableCategories.map((category)=><option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="mt-5 block text-sm font-semibold text-msp-primary">Base price (₹)<input required type="number" min="0" step="0.01" value={form.basePrice} onChange={(e)=>setForm({...form,basePrice:e.target.value})} className="field mt-2"/></label>
        <button disabled={saving} className="btn-primary mt-5 w-full"><Plus size={18} className="mr-2"/>{saving ? 'Saving...' : editing ? 'Update skill' : 'Add skill'}</button>
        {editing && <button type="button" onClick={()=>{setEditing(null);setForm({categoryId:'',basePrice:''})}} className="btn-secondary mt-3 w-full">Cancel</button>}
      </form>
      <div>
        {loading && <p className="text-msp-secondary">Loading skills...</p>}
        {!loading && !error && skills.length===0 && <EmptyState title="No skills added" message="Add your first service category and price to appear in provider search."/>}
        <div className="space-y-4">{skills.map((skill)=><article key={skill.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-msp-softGreen text-msp-primary"><Wrench size={22}/></span><div><h2 className="font-display text-xl font-bold text-msp-primary">{skill.category?.name || skill.categoryName || 'Service'}</h2><p className="text-sm text-msp-secondary">Starting at ₹{Number(skill.basePrice || 0).toLocaleString('en-IN')} · {skill.active === false ? 'Inactive' : 'Active'}</p></div></div>
          <div className="flex gap-2"><button onClick={()=>edit(skill)} className="rounded-lg border border-msp-border p-2 text-msp-primary hover:bg-msp-softGreen" aria-label="Edit"><Pencil size={18}/></button><button onClick={()=>remove(skill.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 size={18}/></button></div>
        </article>)}</div>
      </div>
    </div>
  </div>
}
